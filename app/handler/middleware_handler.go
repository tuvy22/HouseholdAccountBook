package handler

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type MiddlewareHandler interface {
	LocalhostOnly() gin.HandlerFunc
	CheckSessionId() gin.HandlerFunc
	CheckInviteToken() gin.HandlerFunc
}

type middlewareHandlerImpl struct {
	userUsecase  usecase.UserUsecase
	groupUsecase usecase.GroupUsecase
}

func NewMiddlewareHandler(userUsecase usecase.UserUsecase, groupUsecase usecase.GroupUsecase) MiddlewareHandler {
	return &middlewareHandlerImpl{
		userUsecase:  userUsecase,
		groupUsecase: groupUsecase,
	}
}

func (h *middlewareHandlerImpl) LocalhostOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		// リクエストのIPアドレスを取得
		ip := c.ClientIP()

		// IPアドレスがlocalhost (127.0.0.1) でない場合、アクセスを拒否
		if !strings.HasPrefix(ip, "127.0.0.1") {
			if os.Getenv("ENV") != "development" {
				errorResponder(c, customerrors.NewCustomError(customerrors.ErrInvalidCredentials))
				return
			}
		}

		c.Next()
	}
}

func (h *middlewareHandlerImpl) CheckSessionId() gin.HandlerFunc {
	return func(c *gin.Context) {
		sessionID, err := c.Cookie(SessionIDCookie)

		if err != nil || sessionID == "" {
			errorResponder(c, customerrors.NewCustomError(customerrors.ErrNoSession))
			return
		}

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
				errorResponder(c, customerrors.NewCustomError(customerrors.ErrInvalidCredentials))
			}
			return
		}
		groupId, err := h.groupUsecase.CheckInviteToken(tokenString)
		if err != nil {
			errorResponder(c, customerrors.NewCustomError(customerrors.ErrInvalidCredentials))
			return
		}

		c.Set("group_id", groupId)

		c.Next()
	}
}
