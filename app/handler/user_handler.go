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
	ChangePassword(c *gin.Context)
	DeleteUser(c *gin.Context)
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
		errorResponder(c, err)
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
		errorResponder(c, err)
		return
	}

	inviteGroupID, err := GetInviteGroupID(c)
	if err != nil {
		errorResponder(c, err)
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
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, users)
}
func (h *userHandlerImpl) GetGroupAllUser(c *gin.Context) {
	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	users, err := h.usecase.GetGroupAllUser(loginUser.GroupID, loginUser.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *userHandlerImpl) GetLoginUser(c *gin.Context) {
	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, loginUser)
}

func (h *userHandlerImpl) CreateUser(c *gin.Context) {
	userCreate, err := h.bindUserCreate(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	inviteGroupID, err := GetInviteGroupID(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	user, userSession, err := h.usecase.CreateUser(userCreate, inviteGroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}
	// セッションにデータを設定
	session := sessions.Default(c)
	session.Set("user", userSession)
	err = session.Save()
	if err != nil {
		errorResponder(c, err)
		return
	}

	//招待された場合の処理
	if inviteGroupID != entity.GroupIDNone {
		h.deleteInviteCookie(c)
	}
	c.JSON(http.StatusOK, user)
}
func (h *userHandlerImpl) UpdateUser(c *gin.Context) {

	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	user, err := h.bindUserUpdate(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	userResponse, userSession, err := h.usecase.UpdateUser(loginUser.ID, c.Param("id"), user)
	if err != nil {
		errorResponder(c, err)
		return
	}

	// セッションにデータを設定
	session := sessions.Default(c)
	session.Set("user", userSession)
	err = session.Save()
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, userResponse)
}

func (h *userHandlerImpl) ChangePassword(c *gin.Context) {

	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	passwordChange, err := h.bindPasswordChange(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.ChangePassword(loginUser.ID, c.Param("id"), passwordChange)
	if err != nil {
		errorResponder(c, err)
		return
	}
	c.Status(http.StatusOK)
}

func (h *userHandlerImpl) DeleteUser(c *gin.Context) {

	err := h.usecase.DeleteUser(c.Param("id"))
	if err != nil {
		errorResponder(c, err)
		return
	}
	c.Status(http.StatusOK)
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
func (h *userHandlerImpl) bindUserUpdate(c *gin.Context) (entity.UserUpdate, error) {
	userUpdate := entity.UserUpdate{}
	if err := c.ShouldBindJSON(&userUpdate); err != nil {
		return userUpdate, err
	}
	return userUpdate, nil
}

func (h *userHandlerImpl) bindInviteToken(c *gin.Context) (entity.InviteToken, error) {
	inviteToken := entity.InviteToken{}
	if err := c.ShouldBindJSON(&inviteToken); err != nil {
		return inviteToken, err
	}
	return inviteToken, nil
}
func (h *userHandlerImpl) bindPasswordChange(c *gin.Context) (entity.PasswordChange, error) {
	passwordChange := entity.PasswordChange{}
	if err := c.ShouldBindJSON(&passwordChange); err != nil {
		return passwordChange, err
	}
	return passwordChange, nil
}

func (h *userHandlerImpl) deleteInviteCookie(c *gin.Context) {

	// トークン(招待用)を持つクッキーの有効期限を過去の日時に設定して削除
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie(InviteCookieToken, "", -1, "/", os.Getenv("ALLOWED_ORIGINS"), true, true)
}
