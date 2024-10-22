package http

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"go_back/internal/entities"
	"go_back/internal/usecases"
	"golang.org/x/crypto/bcrypt"
	"net/http"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	user, err := h.usecase.GetUserByLogin(input.Login)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid login"})
		return
	}

	// Сравниваем пароли
	if err := bcrypt.CompareHashAndPassword([]byte(user.Pass), []byte(input.Pass)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	// Генерируем JWT токен
	token, err := generateJWT(*user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	// Устанавливаем токен в cookies
	c.SetCookie("token", token, 3600, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
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
		token, err := c.Cookie("token")
		if err != nil {
			c.JSON(409, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		claims := &jwt.StandardClaims{}
		tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})
		if err != nil || !tkn.Valid {
			c.JSON(409, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("user_id", claims.Subject)
		c.Next()
	}
}
