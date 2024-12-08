package usecases

import (
	"errors"
	"go_back/internal/entities"
	"go_back/internal/repository"
)

type FriendUsecase interface {
	SendFriendRequest(userID, friendID int) error
	AcceptFriendRequest(userID, friendID int) error
	RejectFriendRequest(userID, friendID int) error
	CancelFriendRequest(userID, friendID int) error
	IsFriendRequestPending(userID, friendID int) (bool, error)
	GetFriendRequests(userID int) ([]entities.FriendRequest, error)
}

type friendUsecase struct {
	repo repository.FriendRepository
}

func NewFriendUsecase(repo repository.FriendRepository) FriendUsecase {
	return &friendUsecase{repo: repo}
}

func (u *friendUsecase) SendFriendRequest(userID, friendID int) error {
	if userID == friendID {
		return errors.New("cannot send friend request to yourself")
	}

	isFriend, err := u.repo.AreFriends(userID, friendID)
	if err != nil {
		return err
	}
	if isFriend {
		return errors.New("users are already friends")
	}

	isPending, err := u.repo.IsFriendRequestPending(userID, friendID)
	if err != nil {
		return err
	}
	if isPending {
		return errors.New("friend request already pending")
	}

	return u.repo.CreateFriendRequest(userID, friendID)
}

func (u *friendUsecase) AcceptFriendRequest(userID, friendID int) error {
	if userID == friendID {
		return errors.New("cannot accept your own friend request")
	}

	return u.repo.AcceptFriendRequest(userID, friendID)
}

func (u *friendUsecase) RejectFriendRequest(userID, friendID int) error {
	isPending, err := u.repo.IsFriendRequestPending(friendID, userID)
	if err != nil {
		return err
	}
	if !isPending {
		return errors.New("no friend request to reject")
	}

	return u.repo.RejectFriendRequest(userID, friendID)
}

func (u *friendUsecase) CancelFriendRequest(userID, friendID int) error {
	isPending, err := u.repo.IsFriendRequestPending(userID, friendID)
	if err != nil {
		return err
	}
	if !isPending {
		return errors.New("no friend request to cancel")
	}
	return u.repo.DeleteFriendRequest(userID, friendID)
}

func (u *friendUsecase) IsFriendRequestPending(userID, friendID int) (bool, error) {
	return u.repo.IsFriendRequestPending(userID, friendID)
}

func (u *friendUsecase) GetFriendRequests(userID int) ([]entities.FriendRequest, error) {
	return u.repo.GetFriendRequests(userID)
}
