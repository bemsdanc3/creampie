package repository

import (
	"database/sql"
	"go_back/internal/entities"
)

type UserRepository interface {
	GetAllUsers() ([]*entities.User, error)
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

//func (r *userRepository) GetAllUsers() ([]*entities.User, error) {
//query := `SELECT`
//}
