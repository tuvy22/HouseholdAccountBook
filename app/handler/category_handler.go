package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type CategoryHandler interface {
	CreateCategory(c *gin.Context)
	DeleteCategory(c *gin.Context)
	GetAllIncomeCategory(c *gin.Context)
	GetAllExpenseCategory(c *gin.Context)
}

type categoryHandlerImpl struct {
	usecase usecase.CategoryUsecase
}

func NewCategoryHandler(u usecase.CategoryUsecase) CategoryHandler {
	return &categoryHandlerImpl{usecase: u}
}
func (h *categoryHandlerImpl) CreateCategory(c *gin.Context) {
	data, err := h.bindCreateCategory(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	//ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.CreateCategory(data, userResponse.GroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
}
func (h *categoryHandlerImpl) DeleteCategory(c *gin.Context) {

	id, err := h.getID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	//ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.DeleteCategory(id, userResponse.GroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.Status(http.StatusOK)
}

func (h *categoryHandlerImpl) GetAllIncomeCategory(c *gin.Context) {
	//ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetAllIncomeCategory(userResponse.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}
func (h *categoryHandlerImpl) GetAllExpenseCategory(c *gin.Context) {
	//ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetAllExpenseCategory(userResponse.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *categoryHandlerImpl) bindCreateCategory(c *gin.Context) (entity.Category, error) {
	CategoryCreate := entity.Category{}
	if err := c.BindJSON(&CategoryCreate); err != nil {
		return CategoryCreate, err
	}

	return CategoryCreate, nil
}
func (h *categoryHandlerImpl) getID(c *gin.Context) (uint, error) {
	idstr := c.Param("id")
	val, err := strconv.ParseUint(idstr, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(val), nil
}
