package main

import (
	"log"

	"go_back/internal/app" // Убедитесь, что путь правильный
)

func main() {
	a := app.New() // Создайте экземпляр App
	if err := a.Run(); err != nil {
		log.Fatalf("Ошибка запуска приложения: %v", err)
	}
}
