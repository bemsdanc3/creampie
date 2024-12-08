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
	AddToBlackList(userID, blockedUserID int) error
	RemoveFromBlackList(userID, blockedUserID int) error
	IsUserBlocked(userID, blockedUserID int) (bool, error)
	GetBlackListByUserID(userID int) ([]entities.User, error)
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

func (u *userUsecase) AddToBlackList(userID, blockedUserID int) error {
	if userID == blockedUserID {
		return fmt.Errorf("Cannot block yourself")
	}

	isBlocked, err := u.repo.IsUserBlocked(userID, blockedUserID)
	if err != nil {
		return err
	}

	if isBlocked { // пользователь уже в черном списке
		return fmt.Errorf("User is already blocked")
	}

	return u.repo.AddToBlackList(userID, blockedUserID)
}

func (u *userUsecase) RemoveFromBlackList(userID, blockedUserID int) error {

	isBlocked, err := u.repo.IsUserBlocked(userID, blockedUserID)
	if err != nil {
		return err
	}

	if !isBlocked {
		return fmt.Errorf("user is not blocked")
	}

	return u.repo.RemoveFromBlackList(userID, blockedUserID)
}

func (u *userUsecase) IsUserBlocked(userID, blockedUserID int) (bool, error) {
	return u.repo.IsUserBlocked(userID, blockedUserID)
}

func (u *userUsecase) GetBlackListByUserID(userID int) ([]entities.User, error) {
	return u.repo.GetBlackListByUserID(userID)
}
