package usecases

import (
	"fmt"
	"go_back/internal/entities"
	"go_back/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserUsecase interface {
	CreateUser(user *entities.User) error
	GetUserByEmail(email string) (*entities.User, error)
	GetUserByID(id int) (*entities.User, error)
}

type userUsecase struct {
	repo repository.UserRepository
}

func NewUserUsecase(repo repository.UserRepository) UserUsecase {
	return &userUsecase{repo: repo}
}

func (u *userUsecase) CreateUser(user *entities.User) error {
	exists, err := u.repo.IsEmailExists(user.Email) //проверка почты на уникальность
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("email already in use")
	}

	loginExists, err := u.repo.IsLoginExists(user.Login) //проверка логина на уникальность
	if err != nil {
		return err
	}
	if loginExists {
		return fmt.Errorf("login already in use")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Pass), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Pass = string(hashedPassword)
	return u.repo.CreateUser(user)
}

func (u *userUsecase) GetUserByEmail(email string) (*entities.User, error) {
	return u.repo.GetUserByEmail(email)
}

func (u *userUsecase) GetUserByID(id int) (*entities.User, error) {
	return u.repo.GetUserByID(id)
}
