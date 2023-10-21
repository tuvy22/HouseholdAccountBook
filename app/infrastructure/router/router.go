package router

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/adapter/handler"
	"github.com/ten313/HouseholdAccountBook/app/adapter/middleware"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

func NewRouter(cfg config.Config, authHandler handler.AuthHandler, incomeAndExpenseHandler handler.IncomeAndExpenseHandler, responsedOKHandler handler.ResponsedOKHandler) *gin.Engine {
	r := gin.Default()

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true

	public := r.Group("/api/public/")
	public.Use(cors.New(config))
	public.POST("/auth", authHandler.Authenticate)

	localhost := r.Group("/api/localhost/")
	localhost.Use(middleware.LocalhostOnly())
	localhost.GET("/incomeAndExpense", incomeAndExpenseHandler.GetIncomeAndExpenses)

	authorized := r.Group("/api/private/")
	authorized.Use(middleware.CheckToken(cfg))
	authorized.GET("/check-auth", responsedOKHandler.ResponsedOK)

	return r
}
