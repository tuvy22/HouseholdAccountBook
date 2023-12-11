package main

import (
	"encoding/gob"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/ten313/HouseholdAccountBook/app/domain/customvalidator"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/password"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
	"github.com/ten313/HouseholdAccountBook/app/handler"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/db"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/router"

	"github.com/go-playground/validator/v10"
)

func init() {
	// gob に UserSession 型を登録
	gob.Register(entity.UserSession{})
}

func main() {

	// 設定をロードする
	originalConfig := config.LoadConfig()

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

	validate := validator.New()
	userValidator := customvalidator.NewUserValidator(validate)
	incomeAndExpenseValidator := customvalidator.NewIncomeAndExpenseValidator(validate)
	liquidationValidator := customvalidator.NewLiquidationValidator(validate)
	categoryValidator := customvalidator.NewCategoryValidator(validate)
	groupValidator := customvalidator.NewGroupValidator(validate)

	incomeAndExpenseUsecase := usecase.NewIncomeAndExpenseUsecase(incomeAndExpenseRepo, userRepo, groupRepo, incomeAndExpenseValidator)
	incomeAndExpenseHandler := handler.NewIncomeAndExpenseHandler(incomeAndExpenseUsecase)

	liquidationUsecase := usecase.NewLiquidationUsecase(liquidationRepo, incomeAndExpenseRepo, userRepo, liquidationValidator)
	liquidationHandler := handler.NewLiquidationHandler(liquidationUsecase)

	categoryUsecase := usecase.NewCategoryUsecase(categoryRepo, categoryValidator)
	categoryHandler := handler.NewCategoryHandler(categoryUsecase)

	password := password.NewPassWord()
	userUsecase := usecase.NewUserUsecase(userRepo, groupRepo, categoryRepo, password, originalConfig, userValidator)
	userHandler := handler.NewUserHandler(userUsecase)

	groupUsecase := usecase.NewGroupUsecase(groupRepo, originalConfig, groupValidator)
	groupHandler := handler.NewGroupHandler(groupUsecase)

	middlewareHandler := handler.NewMiddlewareHandler(userUsecase, groupUsecase)

	responsedOKHandler := handler.NewResponsedOKHandler()

	r := router.NewRouter(originalConfig, userHandler, groupHandler, incomeAndExpenseHandler, liquidationHandler, categoryHandler, responsedOKHandler, middlewareHandler)

	r.Run(":8080")
}
