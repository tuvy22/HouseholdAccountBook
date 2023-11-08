package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type MiddlewareHandler interface {
	LocalhostOnly() gin.HandlerFunc
	CheckLoginToken() gin.HandlerFunc
	CheckInviteToken() gin.HandlerFunc
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

func (h *middlewareHandlerImpl) CheckLoginToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie(LonginCookieToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		userId, err := h.usecase.CheckLoginToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		c.Set("user_id", userId)

		c.Next()
	}
}
func (h *middlewareHandlerImpl) CheckInviteToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie(InviteCookieToken)
		if err != nil {
			if err == http.ErrNoCookie {
				//グループ招待時以外は存在しないため、エラーではない。
				c.Set("group_id", entity.GroupIDNone)
				c.Next()
			} else {
				// 他のエラーの場合は、エラーレスポンスを返す
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		groupId, err := h.usecase.CheckInviteToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		c.Set("group_id", groupId)

		c.Next()
	}
}
