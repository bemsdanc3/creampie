package app

import (
	"fmt"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
	"go_back/internal/middleware"
)

// App структура приложения
type App struct {
	router *gin.Engine
}

// New создаёт новое приложение
func New() *App {
	return &App{
		router: gin.Default(),
	}
}

// Run запускает приложение
func (a *App) Run() error {
	a.setupRoutes()

	const PORT = 3000
	return a.router.Run(fmt.Sprintf(":%d", PORT))
}

// setupRoutes настраивает маршруты
func (a *App) setupRoutes() {
	// CORS middleware
	a.router.Use(middleware.CORSMiddleware())

	// URL для микросервисов
	jsServiceURL, _ := url.Parse("http://localhost:1488") // Микросервис на JS
	goServiceURL, _ := url.Parse("http://localhost:3002") // Микросервис на Go

	// Перенаправление запросов на микросервис на JS
	jsProxy := httputil.NewSingleHostReverseProxy(jsServiceURL)
	a.router.GET("/js-service/*proxyPath", func(c *gin.Context) {
		c.Request.URL.Path = c.Param("proxyPath") // Изменяет путь на нужный
		jsProxy.ServeHTTP(c.Writer, c.Request)
	})

	// Перенаправление запросов на микросервис на Go
	goProxy := httputil.NewSingleHostReverseProxy(goServiceURL)
	a.router.GET("/go-service/*proxyPath", func(c *gin.Context) {
		c.Request.URL.Path = c.Param("proxyPath") // Изменяет путь на нужный
		goProxy.ServeHTTP(c.Writer, c.Request)
	})

	// Статические файлы
	a.router.Static("/static", "../frontend/dist") // Пример для статических файлов
}
