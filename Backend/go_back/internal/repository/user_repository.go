package repository

import (
	"database/sql"
	"fmt"
	"github.com/lib/pq"
	"go_back/internal/entities"
)

type UserRepository interface {
	CreateUser(user *entities.User) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateUser(user *entities.User) error {
	query := `INSERT INTO users (login, email, pass) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(query, user.Login, user.Email, user.Pass)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" { // код ошибки для уникального ограничения
			return fmt.Errorf("пользователь с таким email уже существует")
		}
		return err
	}
	return nil
}
