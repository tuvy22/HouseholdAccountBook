package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type IncomeAndExpenseHandler interface {
	GetAllIncomeAndExpense(c *gin.Context)
	GetAllIncomeAndExpenseMaxPage(c *gin.Context)
	GetIncomeAndExpenseLiquidations(c *gin.Context)

	CreateIncomeAndExpense(c *gin.Context)
	UpdateIncomeAndExpense(c *gin.Context)
	DeleteIncomeAndExpense(c *gin.Context)

	GetMonthlyTotal(c *gin.Context)
	GetMonthlyCategory(c *gin.Context)
}

type incomeAndExpenseHandlerImpl struct {
	usecase usecase.IncomeAndExpenseUsecase
}

func NewIncomeAndExpenseHandler(u usecase.IncomeAndExpenseUsecase) IncomeAndExpenseHandler {
	return &incomeAndExpenseHandlerImpl{usecase: u}
}

func (h *incomeAndExpenseHandlerImpl) GetAllIncomeAndExpense(c *gin.Context) {

	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.ParseUint(pageStr, 10, 64)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetAllIncomeAndExpense(loginUser.GroupID, int(page))
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *incomeAndExpenseHandlerImpl) GetAllIncomeAndExpenseMaxPage(c *gin.Context) {
	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetAllIncomeAndExpenseMaxPage(loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *incomeAndExpenseHandlerImpl) GetIncomeAndExpenseLiquidations(c *gin.Context) {
	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	// クエリパラメータを取得する
	fromDateStr := c.DefaultQuery("fromDate", "")
	toDateStr := c.DefaultQuery("toDate", "")
	targetUserId := c.Query("targetUserId")

	// 日付のフォーマットを定義する
	layout := "2006-01-02"

	// fromDateのパース
	var fromDate time.Time
	if fromDateStr != "" {
		fromDate, err = time.Parse(layout, fromDateStr)
		if err != nil {
			customerrors := customerrors.NewCustomError(customerrors.ErrBadRequest)
			errorResponder(c, customerrors)
			return
		}
	}

	// toDateのパース
	var toDate time.Time
	if toDateStr != "" {
		toDate, err = time.Parse(layout, toDateStr)
		if err != nil {
			customerrors := customerrors.NewCustomError(customerrors.ErrBadRequest)
			errorResponder(c, customerrors)
			return
		}
	}

	result, err := h.usecase.GetIncomeAndExpenseLiquidations(fromDate, toDate, loginUser.ID, targetUserId, loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *incomeAndExpenseHandlerImpl) CreateIncomeAndExpense(c *gin.Context) {
	data, err := h.bindIncomeAndExpenseCreate(c)
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

	err = h.usecase.CreateIncomeAndExpense(data, loginUser.ID, loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.Status(http.StatusOK)
}
func (h *incomeAndExpenseHandlerImpl) UpdateIncomeAndExpense(c *gin.Context) {

	incomeAndExpense, err := h.bindIncomeAndExpenseUpdate(c)
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

	updateID, err := h.getID(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.UpdateIncomeAndExpense(updateID, incomeAndExpense, loginUser.ID, loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.Status(http.StatusOK)
}
func (h *incomeAndExpenseHandlerImpl) DeleteIncomeAndExpense(c *gin.Context) {

	id, err := h.getID(c)
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

	err = h.usecase.DeleteIncomeAndExpense(id, loginUser.ID)
	if err != nil {
		errorResponder(c, err)
		return
	}
	c.Status(http.StatusOK)
}

func (h *incomeAndExpenseHandlerImpl) GetMonthlyTotal(c *gin.Context) {

	// ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}
	monthlyTotals, err := h.usecase.GetMonthlyTotal(loginUser.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, monthlyTotals)
}
func (h *incomeAndExpenseHandlerImpl) GetMonthlyCategory(c *gin.Context) {

	yearMonth := c.DefaultQuery("yearMonth", "")
	isMinus, err := strconv.ParseBool(c.DefaultQuery("isMinus", ""))
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

	monthlyCategorys, err := h.usecase.GetMonthlyCategory(yearMonth, loginUser.GroupID, isMinus)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, monthlyCategorys)

}
func (h *incomeAndExpenseHandlerImpl) bindIncomeAndExpenseCreate(c *gin.Context) (entity.IncomeAndExpenseCreate, error) {
	result := entity.IncomeAndExpenseCreate{}
	if err := c.BindJSON(&result); err != nil {
		return result, err
	}

	return result, nil
}
func (h *incomeAndExpenseHandlerImpl) bindIncomeAndExpenseUpdate(c *gin.Context) (entity.IncomeAndExpenseUpdate, error) {
	result := entity.IncomeAndExpenseUpdate{}
	if err := c.BindJSON(&result); err != nil {
		return result, err
	}

	return result, nil
}

func (h *incomeAndExpenseHandlerImpl) getID(c *gin.Context) (uint, error) {
	idstr := c.Param("id")
	val, err := strconv.ParseUint(idstr, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(val), nil
}
