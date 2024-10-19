package usecases

import (
	"go_back/internal/entities"
	"go_back/internal/repository"
)

type UserUsecase interface {
	CreateUser(user *entities.User) error
}

type userUsecase struct {
	repo repository.UserRepository
}

func NewUserUseCase(repo repository.UserRepository) UserUsecase {
	return &userUsecase{repo: repo}
}

func (u *userUsecase) CreateUser(user *entities.User) error {
	return u.repo.CreateUser(user)
}
