package server

import (
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"go_back/internal/usecases"
	"log"
	"net/http"
	"strconv"
)

type FriendHandler struct {
	usecase usecases.FriendUsecase
}

func NewFriendHandler(usecase usecases.FriendUsecase) *FriendHandler {
	return &FriendHandler{usecase: usecase}
}

func (h *FriendHandler) GetUserIDFromCookie(r *http.Request) (int, error) {
	cookie, err := r.Cookie("user_id")
	if err != nil {
		return 0, errors.New("user_id cookie not found")
	}

	userID, err := strconv.Atoi(cookie.Value)
	if err != nil {
		log.Println(err)
		return 0, errors.New("invalid user_id format in cookie")
	}

	return userID, nil
}

func (h *FriendHandler) GetFriendIDFromRouter(r *http.Request) (int, error) {
	vars := mux.Vars(r)

	friendIDStr, ok := vars["friend_id"]
	if !ok {
		return 0, errors.New("friend_id not provided in route")
	}

	friendID, err := strconv.Atoi(friendIDStr)
	if err != nil {
		return 0, errors.New("invalid friend_id format in route")
	}

	return friendID, nil
}

func (h *FriendHandler) SendFriendRequest(w http.ResponseWriter, r *http.Request) {
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	friendID, err := h.GetFriendIDFromRouter(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if userID == friendID {
		http.Error(w, "Cannot send friend request to yourself", http.StatusBadRequest)
		return
	}

	err = h.usecase.SendFriendRequest(userID, friendID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Friend request sent successfully"})
}

func (h *FriendHandler) AcceptFriendRequest(w http.ResponseWriter, r *http.Request) {
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	friendID, err := h.GetFriendIDFromRouter(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if userID == friendID {
		http.Error(w, "Cannot accept your own friend request", http.StatusBadRequest)
		return
	}

	err = h.usecase.AcceptFriendRequest(userID, friendID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Friend request accepted"})
}

func (h *FriendHandler) RejectFriendRequest(w http.ResponseWriter, r *http.Request) {
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	friendID, err := h.GetFriendIDFromRouter(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	isPending, err := h.usecase.IsFriendRequestPending(friendID, userID)
	if err != nil {
		http.Error(w, "Failed to verify friend request", http.StatusInternalServerError)
		return
	}
	if !isPending {
		http.Error(w, "You cannot reject this friend request", http.StatusBadRequest)
		return
	}

	err = h.usecase.RejectFriendRequest(userID, friendID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Friend request rejected"})
}

func (h *FriendHandler) CancelFriendRequest(w http.ResponseWriter, r *http.Request) {
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	friendID, err := h.GetFriendIDFromRouter(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	isPending, err := h.usecase.IsFriendRequestPending(userID, friendID)
	if err != nil {
		http.Error(w, "Failed to verify friend request", http.StatusInternalServerError)
		return
	}
	if !isPending {
		http.Error(w, "You cannot cancel this friend request", http.StatusBadRequest)
		return
	}

	err = h.usecase.CancelFriendRequest(userID, friendID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Friend request canceled"})
}

func (h *FriendHandler) GetFriendRequests(w http.ResponseWriter, r *http.Request) {
	// Получаем ID текущего пользователя
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Получаем заявки в друзья
	requests, err := h.usecase.GetFriendRequests(userID)
	if err != nil {
		http.Error(w, "Error retrieving friend requests", http.StatusInternalServerError)
		return
	}

	// Возвращаем список заявок в формате JSON
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(requests); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}
