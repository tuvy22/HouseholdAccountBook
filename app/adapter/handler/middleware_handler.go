package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type MiddlewareHandler interface {
	LocalhostOnly() gin.HandlerFunc
	CheckToken() gin.HandlerFunc
}

type middlewareHandlerImpl struct {
	usecase usecase.UserUsecase
}

func NewMiddlewareHandler(u usecase.UserUsecase) MiddlewareHandler {
	return &middlewareHandlerImpl{
		usecase: u,
	}
}

func (h *middlewareHandlerImpl) LocalhostOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		// リクエストのIPアドレスを取得
		ip := c.ClientIP()

		// IPアドレスがlocalhost (127.0.0.1) または ::1 (IPv6のlocalhost) でない場合、アクセスを拒否
		if !strings.HasPrefix(ip, "127.0.0.1") && !strings.HasPrefix(ip, "::1") {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Access forbidden: only localhost can access."})
			return
		}

		c.Next()
	}
}

func (h *middlewareHandlerImpl) CheckToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("jwt")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token not found"})
			return
		}
		userID, err := h.usecase.CheckLoginToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token not found"})
			return
		}

		c.Set("user_id", userID)

		c.Next()
	}
}
