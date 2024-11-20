package server

import (
	"context"
	"encoding/json"
	"github.com/golang-jwt/jwt"
	"go_back/internal/entities"
	"go_back/internal/usecases"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type UserHandler struct {
	usecase usecases.UserUsecase
}

func NewUserHandler(usecase usecases.UserUsecase) *UserHandler {
	return &UserHandler{usecase: usecase}
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusBadRequest)
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
		http.Error(w, "Method not allowed", http.StatusBadRequest)
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

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(time.Hour),
		HttpOnly: true,
		Path:     "/",
	})
	json.NewEncoder(w).Encode(map[string]string{"message": "login successful"})
}

func generateJWT(user entities.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.UUID,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	})
	return token.SignedString(jwtSecret)
}

func (h *UserHandler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || len(authHeader) < 7 || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, `{"error": "Unauthorized"}`, http.StatusUnauthorized)
			return
		}

		tokenString := authHeader[7:]
		claims := &jwt.MapClaims{}
		tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !tkn.Valid {
			http.Error(w, `{"error": "Invalid token"}`, http.StatusUnauthorized)
			return
		}

		// Логирование для отладки
		log.Printf("Token claims: %v", claims)

		userID, ok := (*claims)["user_id"].(string)
		if !ok {
			http.Error(w, `{"error": "Invalid token claims"}`, http.StatusUnauthorized)
			return
		}

		// Добавление user_id в контекст запроса
		ctx := r.Context()
		ctx = context.WithValue(ctx, "user_id", userID)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}
