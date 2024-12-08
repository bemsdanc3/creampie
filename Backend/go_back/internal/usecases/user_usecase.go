package usecases

import (
	"fmt"
	"go_back/internal/entities"
	"go_back/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"log"
)

type UserUsecase interface {
	CreateUser(user *entities.User) error
	GetUserByEmail(email string) (*entities.User, error)
	GetUserByID(id int) (*entities.User, error)
	AddToBlackList(userID, blockedUserID int) error
	RemoveFromBlackList(userID, blockedUserID int) error
	IsUserBlocked(userID, blockedUserID int) (bool, error)
	GetBlackListByUserID(userID int) ([]entities.User, error)
	InviteUserToServer(userID, invitedUserId, serverID int) error
	AcceptServerInvite(userID, serverID int) error
	CancelServerInvite(userID, invitedUserId, serverID int) error
	DeclineServerInvite(invitedUserId, serverID int) error
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

func (u *userUsecase) InviteUserToServer(userID, invitedUserId, serverID int) error {
	// Проверка: нельзя отправить приглашение самому себе
	if userID == invitedUserId {
		return fmt.Errorf("you cannot invite yourself to the server")
	}

	// Проверка: приглашение уже существует
	isInvited, err := u.repo.IsUserAlreadyInvited(userID, invitedUserId, serverID)
	if err != nil {
		return err
	}
	if isInvited {
		return fmt.Errorf("user already invited to this server")
	}

	// Проверка: пользователь уже является членом сервера
	isMember, err := u.repo.IsUserMemberOfServer(invitedUserId, serverID)
	if err != nil {
		return err
	}
	if isMember { // Исправлено условие
		return fmt.Errorf("user %d is already a member of server %d", invitedUserId, serverID)
	}

	// Создание приглашения
	return u.repo.CreateServerInvite(userID, invitedUserId, serverID)
}

func (u *userUsecase) AcceptServerInvite(userID, serverID int) error {
	// Проверяем, существует ли приглашение
	isInviteExists, err := u.repo.IsServerInviteExists(userID, serverID)
	if err != nil {
		return err
	}
	if !isInviteExists {
		return fmt.Errorf("no invite found for user %d to server %d", userID, serverID)
	}

	// Получаем информацию о том, кто отправил приглашение
	inviteSenderID, err := u.repo.GetInviteSenderID(userID, serverID)
	if err != nil {
		return err
	}

	// Проверяем, чтобы пользователь не принял приглашение от себя
	if inviteSenderID == userID {
		return fmt.Errorf("you cannot accept your own invitation")
	}

	// Добавляем пользователя в сервер
	err = u.repo.AddUserToServer(userID, serverID)
	if err != nil {
		return err
	}

	// Удаляем приглашение после принятия
	err = u.repo.DeleteServerInvite(userID, serverID)
	if err != nil {
		return err
	}

	return nil
}

func (u *userUsecase) CancelServerInvite(userID, invitedUserId, serverID int) error {
	log.Printf("Canceling invite: userID=%d, invitedUserID=%d, serverID=%d\n", userID, invitedUserId, serverID)

	isInviteExists, err := u.repo.IsUserInviteExists(userID, invitedUserId, serverID)
	if err != nil {
		log.Printf("Error checking if invite exists: %v\n", err)
		return err
	}
	if !isInviteExists { // Исправлено условие
		log.Printf("No invite found for userID=%d, invitedUserID=%d, serverID=%d\n", userID, invitedUserId, serverID)
		return fmt.Errorf("No invite found from user %d to user %d for server %d", userID, invitedUserId, serverID)
	}

	err = u.repo.DeleteUserInvite(userID, invitedUserId, serverID)
	if err != nil {
		log.Printf("Error deleting invite: %v\n", err)
		return err
	}

	log.Println("Invite successfully canceled")
	return nil
}

func (u *userUsecase) DeclineServerInvite(invitedUserId, serverID int) error {
	isInvitedExists, err := u.repo.IsUserReceivedInvite(invitedUserId, serverID)
	if err != nil {
		return err
	}
	if !isInvitedExists {
		return fmt.Errorf("No invite for user %d to server %d", invitedUserId, serverID)
	}

	err = u.repo.DeleteInviteByInvitedUser(invitedUserId, serverID)
	if err != nil {
		return err
	}
	return nil
}
