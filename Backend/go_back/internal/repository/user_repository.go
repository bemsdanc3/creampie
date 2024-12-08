package repository

import (
	"database/sql"
	"go_back/internal/entities"
	"log"
)

type UserRepository interface { // паттерн builder
	CreateUser(user *entities.User) error
	GetUserByEmail(email string) (*entities.User, error)
	IsEmailExists(email string) (bool, error)
	IsLoginExists(login string) (bool, error)
	GetUserByID(id int) (*entities.User, error)
	AddToBlackList(userID, blockedUserID int) error
	RemoveFromBlackList(userID, blockedUserID int) error
	IsUserBlocked(userID, blockedUserID int) (bool, error)
	GetBlackListByUserID(userID int) ([]entities.User, error)
	IsUserAlreadyInvited(userID, invitedUserID, serverID int) (bool, error)
	CreateServerInvite(userID, invitedUserID, serverID int) error
	IsUserMemberOfServer(userID, serverID int) (bool, error)
	IsServerInviteExists(invitedUserID, serverID int) (bool, error)
	DeleteServerInvite(invitedUserID, serverID int) error
	AddUserToServer(userID, serverID int) error
	IsUserInviteExists(userID, invitedUserID, serverID int) (bool, error)
	DeleteUserInvite(userID, invitedUserID, serverID int) error
	IsUserReceivedInvite(invitedUserID, serverID int) (bool, error)
	DeleteInviteByInvitedUser(invitedUserID, serverID int) error
	GetInviteSenderID(userID, serverID int) (int, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateUser(user *entities.User) error {
	_, err := r.db.Exec("INSERT INTO users (login, pass, email) VALUES ($1, $2, $3)", user.Login, user.Pass, user.Email)
	if err != nil {
		log.Printf("Error creating user: %v", err)
	}
	return err
}

func (r *userRepository) GetUserByEmail(email string) (*entities.User, error) {
	var user entities.User
	err := r.db.QueryRow("SELECT id, email, pass FROM users WHERE email = $1", email).Scan(&user.ID, &user.Email, &user.Pass)
	if err != nil {
		log.Printf("Error querying user by email (%s): %v", email, err)
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) IsEmailExists(email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`
	err := r.db.QueryRow(query, email).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) IsLoginExists(login string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE login = $1)`
	err := r.db.QueryRow(query, login).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (r *userRepository) GetUserByID(id int) (*entities.User, error) {
	var user entities.User
	query := `SELECT id, login, pfp, email, is_online, description, reg_date, is_blocked, is_bot, bot_token
			  FROM users 
			  WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(&user.ID, &user.Login, &user.Pfp, &user.Email, &user.IsOnline,
		&user.Description, &user.RegDate, &user.IsBlocked, &user.IsBot, &user.BotToken)
	if err != nil {
		log.Printf("Error querying user by ID (%d): %v", id, err)
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) AddToBlackList(userID, blockedUserID int) error {
	query := `INSERT INTO black_list (user_id, block_user_id) VALUES ($1, $2)`
	log.Printf("Executing query: %s with userID: %d, blockedUserID: %d", query, userID, blockedUserID)
	_, err := r.db.Exec(query, userID, blockedUserID)
	return err
}

func (r *userRepository) RemoveFromBlackList(userID, blockedUserID int) error {
	query := `DELETE FROM black_list WHERE user_id = $1 AND block_user_id = $2`
	_, err := r.db.Exec(query, userID, blockedUserID)
	return err
}

func (r *userRepository) IsUserBlocked(userID, blockedUserID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM black_list WHERE user_id = $1 AND block_user_id = $2)`
	err := r.db.QueryRow(query, userID, blockedUserID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) GetBlackListByUserID(userID int) ([]entities.User, error) {
	query := `
		SELECT u.id, u.login, u.email, u.pfp
		FROM black_list bl
		JOIN users u ON u.id = bl.block_user_id
		WHERE bl.user_id = $1
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var blacklist []entities.User
	for rows.Next() {
		var user entities.User
		err = rows.Scan(&user.ID, &user.Login, &user.Email, &user.Pfp)
		if err != nil {
			return nil, err
		}
		blacklist = append(blacklist, user)
	}
	return blacklist, nil
}

func (r *userRepository) IsUserAlreadyInvited(userID, invitedUserID, serverID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM server_invites WHERE user_id = $1 AND invited_user_id = $2 AND server_id = $3)`
	err := r.db.QueryRow(query, userID, invitedUserID, serverID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) CreateServerInvite(userID, invitedUserID, serverID int) error {
	query := `INSERT INTO server_invites (user_id, invited_user_id, server_id) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(query, userID, invitedUserID, serverID)
	return err
}

func (r *userRepository) IsUserMemberOfServer(userID, serverID int) (bool, error) {
	var isMember bool
	query := `SELECT EXISTS(SELECT 1 FROM server_members WHERE server_id = $1 AND user_id = $2)`
	err := r.db.QueryRow(query, serverID, userID).Scan(&isMember)
	if err != nil {
		return false, err
	}
	return isMember, nil
}

func (r *userRepository) IsServerInviteExists(invitedUserID, serverID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM server_invites WHERE invited_user_id = $1 AND server_id = $2)`
	err := r.db.QueryRow(query, invitedUserID, serverID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) DeleteServerInvite(invitedUserID, serverID int) error {
	query := `DELETE FROM server_invites WHERE invited_user_id = $1 AND server_id = $2`
	_, err := r.db.Exec(query, invitedUserID, serverID)
	return err
}

func (r *userRepository) GetInviteSenderID(userID, serverID int) (int, error) {
	var senderID int
	query := `SELECT user_id FROM server_invites WHERE invited_user_id = $1 AND server_id = $2`
	err := r.db.QueryRow(query, userID, serverID).Scan(&senderID)
	if err != nil {
		return 0, err
	}
	return senderID, nil
}

func (r *userRepository) AddUserToServer(userID, serverID int) error {
	query := `INSERT INTO server_members (user_id, server_id) VALUES ($1, $2)`
	_, err := r.db.Exec(query, userID, serverID)
	return err
}

func (r *userRepository) IsUserInviteExists(userID, invitedUserID, serverID int) (bool, error) {
	log.Printf("Checking if invite exists: userID=%d, invitedUserID=%d, serverID=%d\n", userID, invitedUserID, serverID)
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM server_invites WHERE user_id = $1 AND invited_user_id = $2 AND server_id = $3)`
	err := r.db.QueryRow(query, userID, invitedUserID, serverID).Scan(&exists)
	if err != nil {
		log.Printf("Database error in IsUserInviteExists: %v\n", err)
		return false, err
	}
	log.Printf("Invite exists: %t\n", exists)
	return exists, nil
}

func (r *userRepository) DeleteUserInvite(userID, invitedUserID, serverID int) error {
	log.Printf("Deleting invite: userID=%d, invitedUserID=%d, serverID=%d\n", userID, invitedUserID, serverID)

	query := `DELETE FROM server_invites WHERE user_id = $1 AND invited_user_id = $2 AND server_id = $3`
	_, err := r.db.Exec(query, userID, invitedUserID, serverID)
	if err != nil {
		log.Printf("Database error in DeleteUserInvite: %v\n", err)
	}
	return err
}

func (r *userRepository) IsUserReceivedInvite(invitedUserID, serverID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM server_invites WHERE invited_user_id = $1 AND server_id = $2)`
	err := r.db.QueryRow(query, invitedUserID, serverID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) DeleteInviteByInvitedUser(invitedUserID, serverID int) error {
	query := `DELETE FROM server_invites WHERE invited_user_id = $1 AND server_id = $2`
	_, err := r.db.Exec(query, invitedUserID, serverID)
	return err
}
