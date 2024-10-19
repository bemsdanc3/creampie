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
	database, err := db.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	//инициализация репозиториев
	userRepo := repository.NewUserRepository(database)
	//инициализация юзкейсов
	userUsecase := usecases.UserUsecase(userRepo)
	r := gin.Default()

	//обработка пользовательских запросов
	userHandler := http.NewUserHandler(userUsecase)
	r.POST("/users", userHandler.CreateUser)

	if err := r.Run(":3002"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
