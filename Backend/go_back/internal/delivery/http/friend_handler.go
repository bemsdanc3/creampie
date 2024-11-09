package http

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go_back/internal/usecases"
	"strconv"
)

type FriendHandler struct {
	usecase usecases.FriendUsecase
}

func NewFriendHandler(usecase usecases.FriendUsecase) *FriendHandler {
	return &FriendHandler{usecase: usecase}
}

func getUserIDFromContext(c *gin.Context) (int, error) { //функция, чтобы взять айдишник из токена
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, errors.New("user_id not found in context")
	}
	return userID.(int), nil
}

func (h *FriendHandler) SendFriendRequest(c *gin.Context) { //отправить запрос в друзья
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	friendID, err := strconv.Atoi(c.Param("friend_id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid friend ID"})
		return
	}

	err = h.usecase.SendFriendRequest(userID, friendID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Friend request sent successfully"})
}

func (h *FriendHandler) AcceptFriendRequest(c *gin.Context) { //принять запрос в друзья
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	friendID, err := strconv.Atoi(c.Param("friend_id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid friend ID"})
		return
	}

	err = h.usecase.AcceptFriendRequest(userID, friendID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Friend request accepted"})
}

func (h *FriendHandler) RejectFriendRequest(c *gin.Context) { //отклонить запрос в друзья у того, кому отправили
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	friendID, err := strconv.Atoi(c.Param("friend_id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid friend ID"})
		return
	}

	err = h.usecase.RejectFriendRequest(userID, friendID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Friend request rejected"})
}

func (h *FriendHandler) CancelFriendRequest(c *gin.Context) { //отмена запроса в друзья от того, кто отправил
	userID, err := getUserIDFromContext(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	friendID, err := strconv.Atoi(c.Param("friend_id"))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid friend ID"})
		return
	}

	err = h.usecase.CancelFriendRequest(userID, friendID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Friend request canceled"})
}
