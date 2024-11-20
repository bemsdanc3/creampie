package server

import (
	"go_back/internal/usecases"
)

type FriendHandler struct {
	usecase usecases.FriendUsecase
}

func NewFriendHandler(usecase usecases.FriendUsecase) *FriendHandler {
	return &FriendHandler{usecase: usecase}
}
