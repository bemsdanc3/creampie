package usecases

import (
	"errors"
	"go_back/internal/repository"
)

type FriendUsecase interface {
	//TODO: methods
	SendFriendRequest(userID, friendID int) error
	AcceptFriendRequest(userID, friendID int) error
	RejectFriendRequest(userID, friendID int) error
	CancelFriendRequest(userID, friendID int) error
}

type friendUsecase struct {
	repo repository.FriendRepository
}

func NewFriendUsecase(repo repository.FriendRepository) FriendUsecase {
	return &friendUsecase{repo: repo}
}

func (u *friendUsecase) SendFriendRequest(userID, friendID int) error {
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
	return u.repo.AcceptFriendRequest(userID, friendID)
}

func (u *friendUsecase) RejectFriendRequest(userID, friendID int) error {
	return u.repo.RejectFriendRequest(userID, friendID)
}

func (u *friendUsecase) CancelFriendRequest(userID, friendID int) error {
	return u.repo.DeleteFriendRequest(userID, friendID)
}
