package repository

import (
	"database/sql"
)

type FriendRepository interface {
}

type friendRepository struct {
	db *sql.DB
}

func NewFriendRepository(db *sql.DB) FriendRepository {
	return &friendRepository{db: db}
}
