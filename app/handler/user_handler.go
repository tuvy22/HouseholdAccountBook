package handler

import (
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type UserHandler interface {
	Authenticate(c *gin.Context)
	DeleteAuthenticate(c *gin.Context)
	GetAllUser(c *gin.Context)
	GetLoginUser(c *gin.Context)
	GetGroupAllUser(c *gin.Context)
	CreateUser(c *gin.Context)
	UpdateUser(c *gin.Context)
	DeleteUser(c *gin.Context)
	GetUserInviteUrl(c *gin.Context)
	SetInviteCookie(c *gin.Context)
	DeleteInviteCookie(c *gin.Context)
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

	user, userSession, err := h.usecase.Authenticate(creds)
	if err != nil {
		errorResponder(c, err)
		return
	}

	// セッションにデータを設定
	session := sessions.Default(c)
	session.Set("user", userSession)
	err = session.Save()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

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

		h.deleteInviteCookie(c)
	}

	c.JSON(http.StatusOK, user)
}

func (h *userHandlerImpl) DeleteAuthenticate(c *gin.Context) {

	session := sessions.Default(c)

	// セッションをクリア
	session.Clear()
	err := session.Save()
	if err != nil {
		errorResponder(c, err)
		return
	}
	// セッションクッキーを無効化
	c.SetCookie(SessionIDCookie, "", -1, "/", "", true, true)

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
func (h *userHandlerImpl) GetGroupAllUser(c *gin.Context) {
	// ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	users, err := h.usecase.GetGroupAllUser(userResponse.GroupID, userResponse.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *userHandlerImpl) GetLoginUser(c *gin.Context) {
	// ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}
	c.JSON(http.StatusOK, userResponse)
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

	user, userSession, err := h.usecase.CreateUser(userCreate, inviteGroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	// セッションにデータを設定
	session := sessions.Default(c)
	session.Set("user", userSession)
	err = session.Save()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	//招待された場合の処理
	if inviteGroupID != entity.GroupIDNone {
		h.deleteInviteCookie(c)
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

	_, userSession, err := h.usecase.UpdateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	// セッションにデータを設定
	session := sessions.Default(c)
	session.Set("user", userSession)
	err = session.Save()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
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

func (h *userHandlerImpl) GetUserInviteUrl(c *gin.Context) {
	// ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	inviteUrl, err := h.usecase.GetUserInviteUrl(userResponse.GroupID)
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

func (h *userHandlerImpl) bindInviteToken(c *gin.Context) (entity.InviteToken, error) {
	inviteToken := entity.InviteToken{}
	if err := c.ShouldBindJSON(&inviteToken); err != nil {
		return inviteToken, err
	}
	return inviteToken, nil
}
func (h *userHandlerImpl) DeleteInviteCookie(c *gin.Context) {
	h.deleteInviteCookie(c)
	c.Status(http.StatusOK)
}

func (h *userHandlerImpl) deleteInviteCookie(c *gin.Context) {

	// トークン(招待用)を持つクッキーの有効期限を過去の日時に設定して削除
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(InviteCookieToken, "", -1, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)
}
