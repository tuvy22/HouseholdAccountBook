package handler

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/adapter/handler/context_utils"
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
		if err == usecase.ErrInvalidCredentials {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	// クッキーにトークンを保存
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("jwt", token, 3600, "/", os.Getenv("ALLOWED_ORIGINS"), true, false)

	c.JSON(http.StatusOK, user)
}

func (h *userHandlerImpl) DeleteAuthenticate(c *gin.Context) {

	// トークンを持つクッキーの有効期限を過去の日時に設定して削除
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("jwt", "", -1, "/", os.Getenv("ALLOWED_ORIGINS"), true, false)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})

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
	id, err := context_utils.GetLoginUserID(c)
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

	err = h.usecase.CreateUser(userCreate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
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

	id, err := context_utils.GetLoginUserID(c)
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
	id, err := context_utils.GetLoginUserID(c)
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
