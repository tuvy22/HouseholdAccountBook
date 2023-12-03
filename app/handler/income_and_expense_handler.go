package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/ten313/HouseholdAccountBook/app/customerrors"
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

	//ログインデータ取得
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
	// 日本のタイムゾーンを取得
	jst, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		errorResponder(c, customerrors.NewCustomError(customerrors.ErrInvalidDateFormat))
		return
	}

	// fromDateのパース
	var fromDate time.Time
	if fromDateStr != "" {
		fromDate, err = time.ParseInLocation(layout, fromDateStr, jst)
		if err != nil {
			errorResponder(c, customerrors.NewCustomError(customerrors.ErrInvalidDateFormat))
			return
		}
	}

	// toDateのパース
	var toDate time.Time
	if toDateStr != "" {
		toDate, err = time.ParseInLocation(layout, toDateStr, jst)
		if err != nil {
			errorResponder(c, customerrors.NewCustomError(customerrors.ErrInvalidDateFormat))
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
	data, err := h.bindIncomeAndExpenseWithBillingUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.CreateIncomeAndExpenseWithBillingUser(data, loginUser.ID, loginUser.GroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
}
func (h *incomeAndExpenseHandlerImpl) UpdateIncomeAndExpense(c *gin.Context) {

	incomeAndExpense, err := h.bindIncomeAndExpense(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	incomeAndExpense.ID, err = h.getID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = h.usecase.UpdateIncomeAndExpense(incomeAndExpense, loginUser.ID, loginUser.GroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
}
func (h *incomeAndExpenseHandlerImpl) DeleteIncomeAndExpense(c *gin.Context) {

	id, err := h.getID(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	err = h.usecase.DeleteIncomeAndExpense(id, loginUser.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.Status(http.StatusOK)
}

func (h *incomeAndExpenseHandlerImpl) GetMonthlyTotal(c *gin.Context) {

	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}
	monthlyTotals, err := h.usecase.GetMonthlyTotal(loginUser.GroupID, loginUser.InitialAmount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, monthlyTotals)
}
func (h *incomeAndExpenseHandlerImpl) GetMonthlyCategory(c *gin.Context) {

	yearMonth := c.DefaultQuery("yearMonth", "")
	isMinus, err := strconv.ParseBool(c.DefaultQuery("isMinus", ""))
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	monthlyCategorys, err := h.usecase.GetMonthlyCategory(yearMonth, loginUser.GroupID, isMinus)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, monthlyCategorys)

}
func (h *incomeAndExpenseHandlerImpl) bindIncomeAndExpense(c *gin.Context) (entity.IncomeAndExpense, error) {
	incomeAndExpense := entity.IncomeAndExpense{}
	if err := c.ShouldBindJSON(&incomeAndExpense); err != nil {
		return incomeAndExpense, err
	}

	return incomeAndExpense, nil
}

func (h *incomeAndExpenseHandlerImpl) bindIncomeAndExpenseWithBillingUser(c *gin.Context) (entity.IncomeAndExpense, error) {
	incomeAndExpense := entity.IncomeAndExpense{}
	if err := c.BindJSON(&incomeAndExpense); err != nil {
		return incomeAndExpense, err
	}

	return incomeAndExpense, nil
}

func (h *incomeAndExpenseHandlerImpl) getID(c *gin.Context) (uint, error) {
	idstr := c.Param("id")
	val, err := strconv.ParseUint(idstr, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(val), nil
}
