package server

import (
	"encoding/json"
	"errors"
	"go_back/internal/usecases"
	"net/http"
)

type FriendHandler struct {
	usecase usecases.FriendUsecase
}

func NewFriendHandler(usecase usecases.FriendUsecase) *FriendHandler {
	return &FriendHandler{usecase: usecase}
}

func getUserIDFromContext(r *http.Request) (string, error) { //функция, чтобы взять айдишник из токена
	if userID, ok := r.Context().Value("user_id").(string); ok {
		return userID, nil
	}
	return "", errors.New("user_id not found in context")
}

func (h *FriendHandler) SendFriendRequest(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserIDFromContext(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	friendID := r.URL.Query().Get("friend_id")
	if friendID == "" {
		http.Error(w, "Invalid friend ID", http.StatusBadRequest)
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
	userID, err := getUserIDFromContext(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	friendID := r.URL.Query().Get("friend_id")
	if friendID == "" {
		http.Error(w, "Invalid friend ID", http.StatusBadRequest)
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
	userID, err := getUserIDFromContext(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusInternalServerError)
		return
	}

	friendID := r.URL.Query().Get("friend_id")
	if friendID == "" {
		http.Error(w, "Invalid friend ID", http.StatusBadRequest)
		return
	}

	err = h.usecase.RejectFriendRequest(userID, friendID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "request rejected"})
}

func (h *FriendHandler) CancelFriendRequest(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserIDFromContext(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	friendID := r.URL.Query().Get("friend_id")
	if friendID == "" {
		http.Error(w, "Invalid friend ID", http.StatusBadRequest)
		return
	}

	err = h.usecase.CancelFriendRequest(userID, friendID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "request canceled"})
}
