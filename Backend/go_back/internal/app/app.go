package app

import (
	"github.com/gorilla/mux"
	"go_back/internal/delivery/server"
	"go_back/internal/middleware"
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

	friendRepo := repository.NewFriendRepository(database)
	friendUsecase := usecases.NewFriendUsecase(friendRepo)

	// Инициализация обработчиков
	userHandler := server.NewUserHandler(userUsecase)
	friendHandler := server.NewFriendHandler(friendUsecase)

	r := mux.NewRouter()

	// Обработка пользовательских запросов
	r.HandleFunc("/register", userHandler.Register).Methods(http.MethodPost)
	r.HandleFunc("/login", userHandler.Login).Methods(http.MethodPost)

	// Группа маршрутов для авторизованных пользователей
	authRouter := r.PathPrefix("/").Subrouter()
	authRouter.Use(middleware.AuthMiddleware)

	// Маршруты для работы с друзьями
	authRouter.HandleFunc("/friends/{friend_id}/request", friendHandler.SendFriendRequest).Methods(http.MethodPost)
	authRouter.HandleFunc("/friends/{friend_id}/accept", friendHandler.AcceptFriendRequest).Methods(http.MethodPost)
	authRouter.HandleFunc("/friends/{friend_id}/reject", friendHandler.RejectFriendRequest).Methods(http.MethodPost)
	authRouter.HandleFunc("/friends/{friend_id}/cancel", friendHandler.CancelFriendRequest).Methods(http.MethodPost)

	// Запуск HTTP-сервера
	log.Println("Server is running on :3002")
	if err := http.ListenAndServe(":3002", r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
