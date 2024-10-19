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
	jsServiceURL, _ := url.Parse("http://localhost:3001") // Микросервис на JS
	goServiceURL, _ := url.Parse("http://localhost:3002") // Микросервис на Go

	// Перенаправление запросов на микросервис на JS
	jsProxy := httputil.NewSingleHostReverseProxy(jsServiceURL)
	a.router.NoRoute(func(c *gin.Context) {
		if c.Request.URL.Path == "/js-service" || c.Request.URL.Path[:12] == "/js-service/" {
			c.Request.URL.Path = c.Request.URL.Path[12:] // Удаляет "/js-service" из пути
			jsProxy.ServeHTTP(c.Writer, c.Request)
			return
		}
	})

	// Перенаправление запросов на микросервис на Go
	goProxy := httputil.NewSingleHostReverseProxy(goServiceURL)
	a.router.NoRoute(func(c *gin.Context) {
		if c.Request.URL.Path == "/go-service" || c.Request.URL.Path[:11] == "/go-service/" {
			c.Request.URL.Path = c.Request.URL.Path[11:] // Удаляет "/rest-api-service" из пути
			goProxy.ServeHTTP(c.Writer, c.Request)
			return
		}
	})

	// Статические файлы
	a.router.Static("/static", "../frontend/dist") // Пример для статических файлов
}
