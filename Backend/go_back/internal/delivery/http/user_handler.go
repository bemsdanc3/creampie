package http

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go_back/internal/entities"
	"go_back/internal/usecases"
	"golang.org/x/crypto/bcrypt"
	"log"
	"os"
	"time"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type UserHandler struct {
	usecase usecases.UserUsecase
}

func NewUserHandler(usecase usecases.UserUsecase) *UserHandler {
	return &UserHandler{usecase: usecase}
}

func (h *UserHandler) Register(c *gin.Context) {
	var newUser entities.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.usecase.CreateUser(&newUser); err != nil {
		if err.Error() == "email already in use" {
			c.JSON(400, gin.H{"error": "Email is already in use"})
		} else {
			c.JSON(500, gin.H{"error": "Error creating user"})
		}
		return
	}

	c.JSON(201, gin.H{"message": "User registered successfully"})
}

func (h *UserHandler) Login(c *gin.Context) {
	var input entities.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid data"})
		return
	}

	user, err := h.usecase.GetUserByEmail(input.Email)
	if err != nil {
		c.JSON(401, gin.H{"error": "Invalid email"})
		return
	}

	// Сравниваем пароли
	if err := bcrypt.CompareHashAndPassword([]byte(user.Pass), []byte(input.Pass)); err != nil {
		c.JSON(401, gin.H{"error": "Invalid password"})
		return
	}

	// Генерируем JWT токен
	token, err := generateJWT(*user)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error generating token"})
		return
	}

	// Устанавливаем токен в cookies
	c.SetCookie("token", token, 3600, "/", "localhost", false, true)
	c.SetCookie("user_id", fmt.Sprintf("%d", user.ID), 3600, "/", "localhost", false, true)
	c.JSON(200, gin.H{"message": "Login successful"})
}

func generateJWT(user entities.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	})

	return token.SignedString(jwtSecret)
}

func (h *UserHandler) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		tokenString := authHeader[7:]

		claims := &jwt.MapClaims{}
		tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !tkn.Valid {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Логирование для отладки
		log.Printf("Token claims: %v", claims)

		userID, ok := (*claims)["user_id"].(float64)
		if !ok {
			c.JSON(401, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}
		c.Set("user_id", int(userID))
		c.Next()
	}
}
