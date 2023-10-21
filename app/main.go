package main

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/adapter/handler"
	"github.com/ten313/HouseholdAccountBook/app/adapter/middleware"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/db"
)

func main() {
	r := gin.Default()

	// 設定をロードする
	cfg := config.LoadConfig()

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true

	incomeAndExpenseRepo := repository.NewIncomeAndExpenseRepository(db.GetDB())
	incomeAndExpenseUsecase := usecase.NewIncomeAndExpenseUsecase(incomeAndExpenseRepo)
	incomeAndExpenseHandler := handler.NewIncomeAndExpenseHandler(incomeAndExpenseUsecase)

	authRepo := repository.NewUserRepository(db.GetDB())
	authUsecase := usecase.NewAuthUsecase(authRepo, *cfg)
	authHandler := handler.NewAuthHandler(authUsecase)

	responsedOKHandler := handler.NewResponsedOKHandler()

	public := r.Group("/api/public/")
	public.Use(cors.New(config))
	public.POST("/auth", authHandler.Authenticate)

	localhost := r.Group("/api/localhost/")
	localhost.Use(middleware.LocalhostOnly())
	localhost.GET("/incomeAndExpense", incomeAndExpenseHandler.GetIncomeAndExpenses)

	authorized := r.Group("/api/private/")
	authorized.Use(middleware.CheckToken(*cfg))
	authorized.GET("/check-auth", responsedOKHandler.ResponsedOK)

	r.Run(":8080")
}
