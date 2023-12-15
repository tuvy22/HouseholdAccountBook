package router

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/handler"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

func NewRouter(cfg config.Config, userHandler handler.UserHandler, groupHandler handler.GroupHandler, incomeAndExpenseHandler handler.IncomeAndExpenseHandler, liquidationHandler handler.LiquidationHandler, categoryHandler handler.CategoryHandler, responsedOKHandler handler.ResponsedOKHandler, middlewareHandler handler.MiddlewareHandler) *gin.Engine {
	r := gin.Default()

	// クッキーストアの設定
	store := cookie.NewStore([]byte(os.Getenv("SESSION_SECRET_KEY")))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   1800, // 30分
		HttpOnly: true,
	})
	r.Use(sessions.Sessions(handler.SessionIDCookie, store))

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true

	public := r.Group("/api/public")
	public.Use(middlewareHandler.CheckInviteToken())
	public.POST("/auth", userHandler.Authenticate)
	public.POST("/user", userHandler.CreateUser)
	publicSetInviteCookie := r.Group("/api/public")
	publicSetInviteCookie.POST("/invite-cookie", groupHandler.SetInviteCookie)
	publicSetInviteCookie.DELETE("/invite-cookie", groupHandler.DeleteInviteCookie)

	localhost := r.Group("/api/localhost")
	localhost.Use(middlewareHandler.LocalhostOnly())
	localhost.GET("/user/all", userHandler.GetAllUser)
	localhost.GET("/user/group-all", userHandler.GetGroupAllUser)
	localhost.GET("/income-and-expense/all", incomeAndExpenseHandler.GetAllIncomeAndExpense)
	localhost.GET("/income-and-expense/all/max-page", incomeAndExpenseHandler.GetAllIncomeAndExpenseMaxPage)
	localhost.GET("/income-and-expense/monthly-total", incomeAndExpenseHandler.GetMonthlyTotal)
	localhost.GET("/income-and-expense/liquidations", incomeAndExpenseHandler.GetIncomeAndExpenseLiquidations)
	localhost.GET("/liquidation/all", liquidationHandler.GetAllLiquidation)
	localhost.GET("/category/all/income", categoryHandler.GetAllIncomeCategory)
	localhost.GET("/category/all/expense", categoryHandler.GetAllExpenseCategory)

	authorized := r.Group("/api/private")
	authorized.Use(middlewareHandler.CheckSessionId())
	authorized.GET("/check-auth", responsedOKHandler.ResponsedOK)
	authorized.POST("/auth-del", userHandler.DeleteAuthenticate)

	authorized.GET("/user", userHandler.GetLoginUser)
	authorized.DELETE("/user", userHandler.DeleteUser)
	authorized.PUT("/user", userHandler.UpdateUser)
	authorized.PUT("/user/out-group", userHandler.OutGroup)
	authorized.PUT("/user/password", userHandler.ChangePassword)
	authorized.GET("/user/group-all", userHandler.GetGroupAllUser)
	authorized.GET("/user-invite-url", groupHandler.GetUserInviteUrl)

	authorized.GET("/group/initial-amount", groupHandler.GetInitialAmount)
	authorized.PUT("/group/initial-amount", groupHandler.UpdateInitialAmount)

	authorized.POST("/income-and-expense", incomeAndExpenseHandler.CreateIncomeAndExpense)
	authorized.PUT("/income-and-expense/:id", incomeAndExpenseHandler.UpdateIncomeAndExpense)
	authorized.DELETE("/income-and-expense/:id", incomeAndExpenseHandler.DeleteIncomeAndExpense)
	authorized.GET("/income-and-expense/monthly-category", incomeAndExpenseHandler.GetMonthlyCategory)

	authorized.POST("/liquidation", liquidationHandler.CreateLiquidation)
	authorized.DELETE("/liquidation/:id", liquidationHandler.DeleteLiquidation)

	authorized.GET("/category/all/income", categoryHandler.GetAllIncomeCategory)
	authorized.GET("/category/all/expense", categoryHandler.GetAllExpenseCategory)
	authorized.POST("/replace-all-category/income", categoryHandler.ReplaceAllCategoryIncome)
	authorized.POST("/replace-all-category/expense", categoryHandler.ReplaceAllCategoryExpense)

	return r
}
