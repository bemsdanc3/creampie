package http

import (
	"github.com/gin-gonic/gin"
	"go_back/internal/entities"
	"go_back/internal/usecases"
)

type UserHandler struct {
	usecase usecases.UserUsecase
}

func NewUserHandler(usecase usecases.UserUsecase) *UserHandler {
	return &UserHandler{usecase: usecase}
}
func (h *UserHandler) CreateUser(c *gin.Context) {
	var NewUser entities.User
	if err := c.ShouldBindJSON(&NewUser); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := h.usecase.CreateUser(&NewUser); err != nil {
		if err.Error() == "пользователь с таким email уже существует" {
			c.JSON(409, gin.H{"error": err.Error()})
			return
		}
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"message": "User created successfully!"})
}
