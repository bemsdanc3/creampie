package app

import (
	"github.com/gin-gonic/gin"
	"go_back/pkg/db"
	"log"
)

func Run() {
	database, err := db.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	r := gin.Default()

	if err := r.Run(":3002"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
