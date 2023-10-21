package handler

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type AuthHandler interface {
	Authenticate(c *gin.Context)
}

type authHandlerImpl struct {
	usecase usecase.AuthUsecase
}

func NewAuthHandler(u usecase.AuthUsecase) AuthHandler {
	return &authHandlerImpl{usecase: u}
}

func (h *authHandlerImpl) Authenticate(c *gin.Context) {
	var creds entity.Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, token, err := h.usecase.Authenticate(creds)
	if err != nil {
		if err == usecase.ErrInternalServer {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	// クッキーにトークンを保存
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("jwt", token, 3600, "/", os.Getenv("ALLOWED_ORIGINS"), true, false)

	c.JSON(http.StatusOK, user)
}
