package repository

import (
	"database/sql"
	"go_back/internal/entities"
	"log"
)

type FriendRepository interface {
	CreateFriendRequest(userID, friendID int) error
	AcceptFriendRequest(userID, friendID int) error
	RejectFriendRequest(userID, friendID int) error
	AreFriends(userID, friendID int) (bool, error)
	IsFriendRequestPending(userID, friendID int) (bool, error)
	DeleteFriendRequest(userID, friendID int) error
	GetFriendRequests(userID int) ([]entities.FriendRequest, error)
}

type friendRepository struct {
	db *sql.DB
}

func NewFriendRepository(db *sql.DB) FriendRepository {
	return &friendRepository{db: db}
}

func (r *friendRepository) CreateFriendRequest(userID, friendID int) error {
	query := `INSERT INTO friendship_requests (user_id, potential_friend_id) VALUES ($1, $2)`
	_, err := r.db.Exec(query, userID, friendID)
	if err != nil {
		log.Printf("Error creating friend request: %v", err)
	}
	return err
}

func (r *friendRepository) AcceptFriendRequest(userID, friendID int) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	//удаление запроса в друзья
	deleteQuery := `DELETE FROM friendship_requests WHERE user_id = $1 AND potential_friend_id = $2`
	_, err = tx.Exec(deleteQuery, friendID, userID)
	if err != nil {
		tx.Rollback()
		return err
	}

	insertQuery := `INSERT INTO friend_list (user_id, friend_id) VALUES ($1, $2), ($2, $1)`
	_, err = tx.Exec(insertQuery, userID, friendID)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}

func (r *friendRepository) RejectFriendRequest(userID, friendID int) error { //отклонить запрос в друзья
	query := `DELETE FROM friendship_requests WHERE user_id = $1 AND potential_friend_id = $2`
	_, err := r.db.Exec(query, friendID, userID)
	return err
}

func (r *friendRepository) AreFriends(userID, friendID int) (bool, error) {
	query := `SELECT COUNT(*) FROM friend_list WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`
	var count int
	err := r.db.QueryRow(query, userID, friendID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *friendRepository) IsFriendRequestPending(userID, friendID int) (bool, error) { //проверка наличия запроса в друзья
	query := `SELECT COUNT(*) FROM friendship_requests WHERE user_id = $1 AND potential_friend_id = $2`
	var count int
	err := r.db.QueryRow(query, userID, friendID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *friendRepository) DeleteFriendRequest(userID, friendID int) error {
	query := `DELETE FROM friendship_requests WHERE user_id = $1 AND potential_friend_id = $2`
	_, err := r.db.Exec(query, userID, friendID)
	return err
}

func (r *friendRepository) GetFriendRequests(userID int) ([]entities.FriendRequest, error) {
	var requests []entities.FriendRequest

	// Обновленный SQL запрос
	query := `
		SELECT fr.ID, u.login as sender_login, u.pfp as sender_pfp, uf.login as receiver_login, uf.pfp as receiver_pfp
		FROM friendship_requests fr
		JOIN users u ON fr.user_id = u.ID
		JOIN users uf ON fr.potential_friend_id = uf.ID
		WHERE fr.user_id = $1 OR fr.potential_friend_id = $1
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		log.Printf("Error getting friend requests: %v", err)
		return nil, err
	}
	defer rows.Close()

	// Чтение результатов из запроса
	for rows.Next() {
		var request entities.FriendRequest
		// Здесь исправляем: сканируем в переменные типа string для логинов и аватарок
		if err := rows.Scan(&request.ID, &request.SenderLogin, &request.SenderPfp, &request.ReceiverLogin, &request.ReceiverPfp); err != nil {
			log.Printf("Error scanning row: %v", err)
			return nil, err
		}
		requests = append(requests, request)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating rows: %v", err)
		return nil, err
	}

	return requests, nil
}
