package main

import (
	"encoding/gob"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/logger"
	"github.com/ten313/HouseholdAccountBook/app/domain/password"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
	"github.com/ten313/HouseholdAccountBook/app/handler"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/db"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/router"
)

func init() {
	// gob に UserSession 型を登録
	gob.Register(entity.UserSession{})
}

func main() {

	// 設定をロードする
	originalConfig := config.LoadConfig()

	//ロガー生成
	logger := logger.NewLogrusLogger()

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true

	userRepo := repository.NewUserRepository(db.GetDB())
	groupRepo := repository.NewGroupRepository(db.GetDB())
	incomeAndExpenseRepo := repository.NewIncomeAndExpenseRepository(db.GetDB())
	liquidationRepo := repository.NewLiquidationRepository(db.GetDB())
	categoryRepo := repository.NewCategoryRepository(db.GetDB())

	incomeAndExpenseUsecase := usecase.NewIncomeAndExpenseUsecase(incomeAndExpenseRepo, userRepo)
	incomeAndExpenseHandler := handler.NewIncomeAndExpenseHandler(incomeAndExpenseUsecase, logger)

	liquidationUsecase := usecase.NewLiquidationUsecase(liquidationRepo, incomeAndExpenseRepo, userRepo)
	liquidationHandler := handler.NewLiquidationHandler(liquidationUsecase, logger)

	categoryUsecase := usecase.NewCategoryUsecase(categoryRepo)
	categoryHandler := handler.NewCategoryHandler(categoryUsecase, logger)

	password := password.NewPassWord()
	userUsecase := usecase.NewUserUsecase(userRepo, groupRepo, categoryRepo, password, originalConfig)
	userHandler := handler.NewUserHandler(userUsecase, logger)
	middlewareHandler := handler.NewMiddlewareHandler(userUsecase)

	responsedOKHandler := handler.NewResponsedOKHandler()

	r := router.NewRouter(originalConfig, userHandler, incomeAndExpenseHandler, liquidationHandler, categoryHandler, responsedOKHandler, middlewareHandler)

	r.Run(":8080")
}
