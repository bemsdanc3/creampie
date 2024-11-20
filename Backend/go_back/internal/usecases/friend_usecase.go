package usecases

import (
	"errors"
	"go_back/internal/repository"
)

type FriendUsecase interface {
	//TODO: methods
	SendFriendRequest(userID, friendID string) error
	AcceptFriendRequest(userID, friendID string) error
	RejectFriendRequest(userID, friendID string) error
	CancelFriendRequest(userID, friendID string) error
}

type friendUsecase struct {
	repo repository.FriendRepository
}

func NewFriendUsecase(repo repository.FriendRepository) FriendUsecase {
	return &friendUsecase{repo: repo}
}

func (u *friendUsecase) SendFriendRequest(userID, friendID string) error {
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

func (u *friendUsecase) AcceptFriendRequest(userID, friendID string) error {
	return u.repo.AcceptFriendRequest(userID, friendID)
}

func (u *friendUsecase) RejectFriendRequest(userID, friendID string) error {
	return u.repo.RejectFriendRequest(userID, friendID)
}

func (u *friendUsecase) CancelFriendRequest(userID, friendID string) error {
	return u.repo.DeleteFriendRequest(userID, friendID)
}
