package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	"go_back/internal/entities"
	"go_back/internal/usecases"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type UserHandler struct {
	usecase usecases.UserUsecase
}

func NewUserHandler(usecase usecases.UserUsecase) *UserHandler {
	return &UserHandler{usecase: usecase}
}

func (h *UserHandler) GetIDFromRouter(r *http.Request) (int, error) {
	vars := mux.Vars(r)

	idStr, ok := vars["id"]
	if !ok {
		return 0, fmt.Errorf("parameter 'id' not found in route")
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		return 0, fmt.Errorf("invalid 'id' format in route: %s", idStr)
	}

	return id, nil
}

func (h *UserHandler) GetUserIDFromCookie(r *http.Request) (int, error) {
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

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newUser entities.User
	if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := h.usecase.CreateUser(&newUser); err != nil {
		if err.Error() == "email already in use" {
			http.Error(w, "email already in use", http.StatusBadRequest)
		} else {
			http.Error(w, "Error creating user", http.StatusBadRequest)
		}
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "user created successfully"})
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input entities.User
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}

	log.Printf("Login attempt for email: %s", input.Email)

	user, err := h.usecase.GetUserByEmail(input.Email)
	if err != nil {
		log.Printf("Error finding user by email: %v", err)
		http.Error(w, "Invalid email", http.StatusUnauthorized)
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Pass), []byte(input.Pass)); err != nil {
		log.Printf("Password mismatch for user: %s", input.Email)
		log.Printf("Stored hash: %s, Input password: %s", user.Pass, input.Pass)
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	token, err := generateJWT(*user)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{ // устанавливаем токен в куки
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(time.Hour),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		Path:     "/",
	})

	http.SetCookie(w, &http.Cookie{ // устанавливаем user_id в куки
		Name:     "user_id",
		Value:    strconv.Itoa(user.ID),
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
		Path:     "/",
	})
	json.NewEncoder(w).Encode(map[string]string{"message": "login successful"})
}

func generateJWT(user entities.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	})
	return token.SignedString(jwtSecret)
}

func (h *UserHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	user, err := h.usecase.GetUserByID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) AddToBlackList(w http.ResponseWriter, r *http.Request) {
	userId, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	blockedUserID, err := h.GetIDFromRouter(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.usecase.AddToBlackList(userId, blockedUserID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "user blocked"})
}

func (h *UserHandler) RemoveFromBlackList(w http.ResponseWriter, r *http.Request) {
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	blockedUser, err := h.GetIDFromRouter(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.usecase.RemoveFromBlackList(userID, blockedUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "user removed from black_list"})
}

func (h *UserHandler) GetBlacklistByUserID(w http.ResponseWriter, r *http.Request) {
	userID, err := h.GetUserIDFromCookie(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	blacklist, err := h.usecase.GetBlackListByUserID(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blacklist)

}
