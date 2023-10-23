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

func NewRouter(cfg config.Config, userHandler handler.UserHandler, incomeAndExpenseHandler handler.IncomeAndExpenseHandler, responsedOKHandler handler.ResponsedOKHandler) *gin.Engine {
	r := gin.Default()

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true

	public := r.Group("/api/public/")
	public.Use(cors.New(config))
	public.POST("/auth", userHandler.Authenticate)

	localhost := r.Group("/api/localhost/")
	localhost.Use(middleware.LocalhostOnly())
	localhost.GET("/user/all", userHandler.GetAllUser)

	localhost.GET("/incomeAndExpenseAll", incomeAndExpenseHandler.GetAllIncomeAndExpense)

	authorized := r.Group("/api/private/")
	authorized.Use(middleware.CheckToken(cfg))
	authorized.GET("/check-auth", responsedOKHandler.ResponsedOK)
	authorized.POST("/auth-del", responsedOKHandler.ResponsedOK)

	authorized.POST("/user/register", userHandler.CreateUser)
	authorized.GET("/user", userHandler.GetLoginUser)
	authorized.DELETE("/user/:id", userHandler.DeleteUser)
	authorized.PUT("/user/:id", userHandler.UpdateUser)

	authorized.POST("/incomeAndExpense", incomeAndExpenseHandler.CreateIncomeAndExpense)
	authorized.PUT("/incomeAndExpense/:id", incomeAndExpenseHandler.UpdateIncomeAndExpense)
	authorized.DELETE("/incomeAndExpense/:id", incomeAndExpenseHandler.DeleteIncomeAndExpense)

	return r
}
