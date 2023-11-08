package handler

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type UserHandler interface {
	Authenticate(c *gin.Context)
	DeleteAuthenticate(c *gin.Context)
	GetAllUser(c *gin.Context)
	GetLoginUser(c *gin.Context)
	CreateUser(c *gin.Context)
	UpdateUser(c *gin.Context)
	DeleteUser(c *gin.Context)
	UpdateUserName(c *gin.Context)
	GetUserInviteUrl(c *gin.Context)
	SetInviteCookie(c *gin.Context)
}

type userHandlerImpl struct {
	usecase usecase.UserUsecase
}

func NewUserHandler(u usecase.UserUsecase) UserHandler {
	return &userHandlerImpl{usecase: u}
}

func (h *userHandlerImpl) Authenticate(c *gin.Context) {
	var creds entity.Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, token, err := h.usecase.Authenticate(creds)
	if err != nil {
		errorResponder(c, err)
		return
	}
	// クッキーにトークンを保存
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(LonginCookieToken, token, 1800, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)

	inviteGroupID, err := GetInviteGroupID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	//招待された場合の処理
	if inviteGroupID != entity.GroupIDNone {
		err := h.usecase.ChangeGroup(user.ID, inviteGroupID)
		if err != nil {
			errorResponder(c, err)
			return
		}

		h.deleteInviteCookieToken(c)
	}

	c.JSON(http.StatusOK, user)
}

func (h *userHandlerImpl) DeleteAuthenticate(c *gin.Context) {

	// トークンを持つクッキーの有効期限を過去の日時に設定して削除
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(LonginCookieToken, "", -1, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)

	c.Status(http.StatusOK)
}

func (h *userHandlerImpl) GetAllUser(c *gin.Context) {

	users, err := h.usecase.GetAllUser()
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, users)
}
func (h *userHandlerImpl) GetLoginUser(c *gin.Context) {
	id, err := GetLoginUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	user, err := h.usecase.GetUser(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *userHandlerImpl) CreateUser(c *gin.Context) {
	userCreate, err := h.bindUserCreate(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	inviteGroupID, err := GetInviteGroupID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	user, token, err := h.usecase.CreateUser(userCreate, inviteGroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	// クッキーにトークンを保存
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(LonginCookieToken, token, 1800, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)

	//招待された場合の処理
	if inviteGroupID != entity.GroupIDNone {
		h.deleteInviteCookieToken(c)
	}
	c.JSON(http.StatusOK, user)
}
func (h *userHandlerImpl) UpdateUser(c *gin.Context) {

	user, err := h.bindUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	user.ID = c.Param("id")

	err = h.usecase.UpdateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
}

func (h *userHandlerImpl) DeleteUser(c *gin.Context) {

	err := h.usecase.DeleteUser(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.Status(http.StatusOK)
}
func (h *userHandlerImpl) UpdateUserName(c *gin.Context) {

	userName, err := h.bindUserName(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	id, err := GetLoginUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = h.usecase.UpdateUserName(id, userName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
}

func (h *userHandlerImpl) GetUserInviteUrl(c *gin.Context) {
	id, err := GetLoginUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	user, err := h.usecase.GetUser(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	inviteUrl, err := h.usecase.GetUserInviteUrl(user.GroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, inviteUrl)

}

func (h *userHandlerImpl) SetInviteCookie(c *gin.Context) {
	inviteToken, err := h.bindInviteToken(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	_, err = h.usecase.CheckInviteToken(inviteToken.Token)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	// クッキーにトークンを保存
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(InviteCookieToken, inviteToken.Token, 1800, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)
}

func (h *userHandlerImpl) bindUser(c *gin.Context) (entity.User, error) {
	user := entity.User{}
	if err := c.ShouldBindJSON(&user); err != nil {
		return user, err
	}
	return user, nil
}
func (h *userHandlerImpl) bindUserCreate(c *gin.Context) (entity.UserCreate, error) {
	userCreate := entity.UserCreate{}
	if err := c.ShouldBindJSON(&userCreate); err != nil {
		return userCreate, err
	}
	return userCreate, nil
}
func (h *userHandlerImpl) bindUserName(c *gin.Context) (entity.UserName, error) {
	userName := entity.UserName{}
	if err := c.ShouldBindJSON(&userName); err != nil {
		return userName, err
	}
	return userName, nil
}
func (h *userHandlerImpl) bindInviteToken(c *gin.Context) (entity.InviteToken, error) {
	inviteToken := entity.InviteToken{}
	if err := c.ShouldBindJSON(&inviteToken); err != nil {
		return inviteToken, err
	}
	return inviteToken, nil
}
func (h *userHandlerImpl) deleteInviteCookieToken(c *gin.Context) {

	// トークン(招待用)を持つクッキーの有効期限を過去の日時に設定して削除
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(InviteCookieToken, "", -1, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)
}
