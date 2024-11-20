package usecases

import (
	"go_back/internal/repository"
)

type FriendUsecase interface {
}

type friendUsecase struct {
	repo repository.FriendRepository
}

func NewFriendUsecase(repo repository.FriendRepository) FriendUsecase {
	return &friendUsecase{repo: repo}
}
