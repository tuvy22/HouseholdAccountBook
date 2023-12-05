package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type CategoryHandler interface {
	ReplaceAllCategoryIncome(c *gin.Context)
	ReplaceAllCategoryExpense(c *gin.Context)
	GetAllIncomeCategory(c *gin.Context)
	GetAllExpenseCategory(c *gin.Context)
}

type categoryHandlerImpl struct {
	usecase usecase.CategoryUsecase
}

func NewCategoryHandler(u usecase.CategoryUsecase) CategoryHandler {
	return &categoryHandlerImpl{usecase: u}
}
func (h *categoryHandlerImpl) ReplaceAllCategoryIncome(c *gin.Context) {
	datas, err := h.bindCreateCategorys(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.ReplaceAllCategory(datas, false, loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.Status(http.StatusOK)
}
func (h *categoryHandlerImpl) ReplaceAllCategoryExpense(c *gin.Context) {
	datas, err := h.bindCreateCategorys(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.ReplaceAllCategory(datas, true, loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.Status(http.StatusOK)
}

func (h *categoryHandlerImpl) GetAllIncomeCategory(c *gin.Context) {
	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetAllIncomeCategory(loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}
func (h *categoryHandlerImpl) GetAllExpenseCategory(c *gin.Context) {
	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetAllExpenseCategory(loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *categoryHandlerImpl) bindCreateCategorys(c *gin.Context) ([]entity.Category, error) {
	CategoryCreates := []entity.Category{}
	if err := c.BindJSON(&CategoryCreates); err != nil {
		return CategoryCreates, err
	}

	return CategoryCreates, nil
}
func (h *categoryHandlerImpl) getID(c *gin.Context) (uint, error) {
	idstr := c.Param("id")
	val, err := strconv.ParseUint(idstr, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(val), nil
}
