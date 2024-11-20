package app

import (
	"go_back/internal/delivery/server"
	"log"
	"net/http"

	"go_back/internal/repository"
	"go_back/internal/usecases"
	"go_back/pkg/db"
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

	mux := http.NewServeMux()

	// Обработка пользовательских запросов
	mux.HandleFunc("/register", userHandler.Register)
	mux.HandleFunc("/login", userHandler.Login)

	// Маршруты дружбы (с использованием middleware)
	friendRoutes := http.NewServeMux()
	friendRoutes.HandleFunc("/friend/request/", friendHandler.SendFriendRequest)
	friendRoutes.HandleFunc("/friend/accept/", friendHandler.AcceptFriendRequest)
	friendRoutes.HandleFunc("/friend/reject/", friendHandler.RejectFriendRequest)
	friendRoutes.HandleFunc("/friend/cancel/", friendHandler.CancelFriendRequest)

	//// Защищённый маршрутизатор для дружбы
	mux.Handle("/friend/", userHandler.AuthMiddleware(friendRoutes))

	// Дополнительный защищённый маршрут
	protected := http.NewServeMux()
	protected.HandleFunc("/protected/data", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "This is protected data"}`))
	})
	mux.Handle("/protected/", userHandler.AuthMiddleware(protected))

	// Запуск HTTP-сервера
	log.Println("Server is running on :3002")
	if err := http.ListenAndServe(":3002", mux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
