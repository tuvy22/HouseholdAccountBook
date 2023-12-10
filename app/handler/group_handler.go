package handler

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type GroupHandler interface {
	GetUserInviteUrl(c *gin.Context)
	SetInviteCookie(c *gin.Context)
	DeleteInviteCookie(c *gin.Context)

	GetInitialAmount(c *gin.Context)
	UpdateInitialAmount(c *gin.Context)
}

type groupHandlerImpl struct {
	usecase usecase.GroupUsecase
}

func NewGroupHandler(u usecase.GroupUsecase) GroupHandler {
	return &groupHandlerImpl{usecase: u}
}

func (h *groupHandlerImpl) GetUserInviteUrl(c *gin.Context) {
	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	inviteUrl, err := h.usecase.GetUserInviteUrl(loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, inviteUrl)

}

func (h *groupHandlerImpl) SetInviteCookie(c *gin.Context) {
	inviteToken, err := h.bindInviteToken(c)
	if err != nil {
		errorResponder(c, err)
		return
	}
	_, err = h.usecase.CheckInviteToken(inviteToken.Token)
	if err != nil {
		errorResponder(c, err)
		return
	}
	// クッキーにトークンを保存
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(InviteCookieToken, inviteToken.Token, 1800, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)
}

func (h *groupHandlerImpl) DeleteInviteCookie(c *gin.Context) {
	h.deleteInviteCookie(c)
	c.Status(http.StatusOK)
}

func (h *groupHandlerImpl) GetInitialAmount(c *gin.Context) {
	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	initialAmount, err := h.usecase.GetInitialAmount(loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, initialAmount)
}

func (h *groupHandlerImpl) UpdateInitialAmount(c *gin.Context) {
	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	initialAmount, err := h.bindInitialAmount(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.UpdateInitialAmount(loginUser.GroupID, initialAmount)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *groupHandlerImpl) bindInviteToken(c *gin.Context) (entity.InviteToken, error) {
	inviteToken := entity.InviteToken{}
	if err := c.ShouldBindJSON(&inviteToken); err != nil {
		return inviteToken, err
	}
	return inviteToken, nil
}

func (h *groupHandlerImpl) bindInitialAmount(c *gin.Context) (entity.InitialAmount, error) {
	initialAmount := entity.InitialAmount{}
	if err := c.ShouldBindJSON(&initialAmount); err != nil {
		return initialAmount, err
	}
	return initialAmount, nil
}

func (h *groupHandlerImpl) deleteInviteCookie(c *gin.Context) {

	// トークン(招待用)を持つクッキーの有効期限を過去の日時に設定して削除
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(InviteCookieToken, "", -1, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)
}
