package app

import (
	"github.com/gin-gonic/gin"
	"go_back/internal/delivery/http"
	"go_back/internal/repository"
	"go_back/internal/usecases"
	"go_back/pkg/db"
	"log"
)

func Run() {
	// инициализация базы данных
	database, err := db.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// инициализация репозиториев и юзкейсов
	userRepo := repository.NewUserRepository(database)
	userUsecase := usecases.NewUserUsecase(userRepo)

	friendRepo := repository.NewFriendRepository(database)
	friendUsecase := usecases.NewFriendUsecase(friendRepo)

	r := gin.Default()

	// обработка пользовательских запросов
	userHandler := http.NewUserHandler(userUsecase)
	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	// защищенные маршруты дружбы
	friendHandler := http.NewFriendHandler(friendUsecase)
	auth := r.Group("/friend")
	auth.Use(userHandler.AuthMiddleware())
	{
		auth.POST("/request/:friend_id", friendHandler.SendFriendRequest)
		auth.POST("/accept/:friend_id", friendHandler.AcceptFriendRequest)
		auth.POST("/reject/:friend_id", friendHandler.RejectFriendRequest)
		auth.POST("/cancel/:friend_id", friendHandler.CancelFriendRequest)
	}

	// дополнительный защищённый маршрут
	protected := r.Group("/protected")
	protected.Use(userHandler.AuthMiddleware())
	{
		protected.GET("/data", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "This is protected data"})
		})
	}

	r.Run(":3002")
}
