package router

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/adapter/handler"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

func NewRouter(cfg config.Config, userHandler handler.UserHandler, incomeAndExpenseHandler handler.IncomeAndExpenseHandler, responsedOKHandler handler.ResponsedOKHandler, middlewareHandler handler.MiddlewareHandler) *gin.Engine {
	r := gin.Default()

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true

	public := r.Group("/api/public")
	public.Use(cors.New(config))
	public.POST("/auth", userHandler.Authenticate)

	public.POST("/user", userHandler.CreateUser)

	localhost := r.Group("/api/localhost")
	localhost.Use(middlewareHandler.LocalhostOnly())
	localhost.GET("/user/all", userHandler.GetAllUser)
	localhost.GET("/income-and-expense/all", incomeAndExpenseHandler.GetAllIncomeAndExpense)
	localhost.GET("/income-and-expense/monthly-total", incomeAndExpenseHandler.GetMonthlyTotal)

	authorized := r.Group("/api/private")
	authorized.Use(middlewareHandler.CheckToken())
	authorized.GET("/check-auth", responsedOKHandler.ResponsedOK)
	authorized.POST("/auth-del", userHandler.DeleteAuthenticate)

	authorized.GET("/user", userHandler.GetLoginUser)
	authorized.DELETE("/user/:id", userHandler.DeleteUser)
	authorized.PUT("/user/:id", userHandler.UpdateUser)
	authorized.PUT("/user/name", userHandler.UpdateUserName)
	authorized.GET("/user-invite-url", userHandler.GetUserInviteUrl)

	authorized.POST("/income-and-expense", incomeAndExpenseHandler.CreateIncomeAndExpense)
	authorized.PUT("/income-and-expense/:id", incomeAndExpenseHandler.UpdateIncomeAndExpense)
	authorized.DELETE("/income-and-expense/:id", incomeAndExpenseHandler.DeleteIncomeAndExpense)
	authorized.GET("/income-and-expense/monthly-category", incomeAndExpenseHandler.GetMonthlyCategory)

	return r
}
