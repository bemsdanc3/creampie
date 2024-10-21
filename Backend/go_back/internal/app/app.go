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
	// Инициализация базы данных
	database, err := db.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Инициализация репозиториев и юзкейсов
	userRepo := repository.NewUserRepository(database)
	userUsecase := usecases.NewUserUsecase(userRepo)

	r := gin.Default()

	// Обработка пользовательских запросов
	userHandler := http.NewUserHandler(userUsecase)
	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	//защищённый маршрут хз зач он нужен но пусть будет
	auth := r.Group("/protected")
	auth.Use(userHandler.AuthMiddleware())
	{
		auth.GET("/data", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "This is protected data"})
		})
	}

	r.Run(":3002")
}
