package main

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/ten313/HouseholdAccountBook/app/adapter/handler"
	"github.com/ten313/HouseholdAccountBook/app/domain/password"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/db"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/router"
)

func main() {

	// 設定をロードする
	originalConfig := config.LoadConfig()

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true

	incomeAndExpenseRepo := repository.NewIncomeAndExpenseRepository(db.GetDB())
	incomeAndExpenseUsecase := usecase.NewIncomeAndExpenseUsecase(incomeAndExpenseRepo)
	incomeAndExpenseHandler := handler.NewIncomeAndExpenseHandler(incomeAndExpenseUsecase)

	userRepo := repository.NewUserRepository(db.GetDB())
	password := password.NewPassWord()
	userUsecase := usecase.NewUserUsecase(userRepo, password, originalConfig)
	userHandler := handler.NewUserHandler(userUsecase)

	responsedOKHandler := handler.NewResponsedOKHandler()

	r := router.NewRouter(originalConfig, userHandler, incomeAndExpenseHandler, responsedOKHandler)

	r.Run(":8080")
}
