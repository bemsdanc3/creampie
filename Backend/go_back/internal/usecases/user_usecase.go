package usecases

import (
	"fmt"
	"go_back/internal/entities"
	"go_back/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserUsecase interface {
	CreateUser(user *entities.User) error
	GetUserByLogin(login string) (*entities.User, error)
}

type userUsecase struct {
	repo repository.UserRepository
}

func NewUserUsecase(repo repository.UserRepository) UserUsecase {
	return &userUsecase{repo: repo}
}

func (u *userUsecase) CreateUser(user *entities.User) error {
	exists, err := u.repo.IsEmailExists(user.Email)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("email already in use")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Pass), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Pass = string(hashedPassword)
	return u.repo.CreateUser(user)
}

func (u *userUsecase) GetUserByLogin(login string) (*entities.User, error) {
	return u.repo.GetUserByLogin(login)
}
