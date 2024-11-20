package app

import (
	"github.com/gorilla/mux"
	"go_back/internal/delivery/server"
	"go_back/internal/repository"
	"go_back/internal/usecases"
	"go_back/pkg/db"
	"log"
	"net/http"
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

	//friendRepo := repository.NewFriendRepository(database)
	//friendUsecase := usecases.NewFriendUsecase(friendRepo)

	// Инициализация обработчиков
	userHandler := server.NewUserHandler(userUsecase)
	//friendHandler := server.NewFriendHandler(friendUsecase)

	r := mux.NewRouter()

	// Обработка пользовательских запросов
	r.HandleFunc("/register", userHandler.Register)
	r.HandleFunc("/login", userHandler.Login)

	// Запуск HTTP-сервера
	log.Println("Server is running on :3002")
	if err := http.ListenAndServe(":3002", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
