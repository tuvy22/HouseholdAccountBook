package handler

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type UserHandler interface {
	Authenticate(c *gin.Context)
	GetAllUser(c *gin.Context)
	GetUser(c *gin.Context)
	CreateUser(c *gin.Context)
	UpdateUser(c *gin.Context)
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
func (h *userHandlerImpl) GetAllUser(c *gin.Context) {

	users, err := h.usecase.GetAllUser()
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, users)
}
func (h *userHandlerImpl) GetUser(c *gin.Context) {
	id, err := h.getLoginUserID(c)
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
	user, err := h.bindUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	err = h.usecase.CreateUser(user)
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

	user.ID, err = h.getLoginUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = h.usecase.UpdateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
}

func (h *userHandlerImpl) DeleteUser(c *gin.Context) {

	id, err := h.getLoginUserID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = h.usecase.DeleteUser(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
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

func (h *userHandlerImpl) getLoginUserID(c *gin.Context) (string, error) {
	userId, exists := c.Get("user_id")
	if !exists {
		return "", fmt.Errorf("User ID not found in context")
	}

	userIdStr, ok := userId.(string)
	if !ok {
		return "", fmt.Errorf("User ID is not a string")
	}
	return userIdStr, nil
}
