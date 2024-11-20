package middleware

import (
	"context"
	"errors"
	"github.com/golang-jwt/jwt"
	"log"
	"net/http"
	"os"
	"strings"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET")) // используйте свой секрет

// AuthMiddleware проверяет наличие токена и аутентифицирует пользователя
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Извлекаем токен из заголовков
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			log.Println("Authorization header missing")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Проверяем, что заголовок содержит 'Bearer'
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Println("Invalid Authorization header format")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		// Проверка токена
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return jwtSecret, nil
		})

		if err != nil {
			log.Printf("Error parsing token: %v\n", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if !token.Valid {
			log.Println("Invalid token")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Извлекаем информацию из токена (например, user_id)
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || claims["user_id"] == nil {
			log.Println("user_id not found in token claims")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Добавляем user_id в контекст запроса
		userID := claims["user_id"].(float64)
		log.Printf("Authenticated user_id: %v\n", userID)
		ctx := context.WithValue(r.Context(), "user_id", int(userID))

		// Логируем контекст после добавления user_id
		log.Printf("Context after adding user_id: %v\n", r.Context())

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
