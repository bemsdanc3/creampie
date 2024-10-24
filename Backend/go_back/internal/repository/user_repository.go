package repository

import (
	"database/sql"
	"go_back/internal/entities"
	"log"
)

type UserRepository interface {
	CreateUser(user *entities.User) error
	GetUserByEmail(email string) (*entities.User, error)
	IsEmailExists(email string) (bool, error)
	IsLoginExists(login string) (bool, error)
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
	err := r.db.QueryRow("SELECT id, login, pass, email FROM users WHERE email = $1", email).Scan(&user.ID, &user.Login, &user.Pass, &user.Email)
	if err != nil {
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
