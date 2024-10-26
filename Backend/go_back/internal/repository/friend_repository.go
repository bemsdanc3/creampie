package repository

import "database/sql"

type FriendRepository interface {
	//TODO: methods
}

type friendRepository struct {
	db *sql.DB
}

func NewFriendRepository(db *sql.DB) FriendRepository {
	return &friendRepository{db: db}
}
