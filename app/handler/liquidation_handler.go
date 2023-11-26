package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type LiquidationHandler interface {
	CreateLiquidation(c *gin.Context)
	DeleteLiquidation(c *gin.Context)
	GetAllLiquidation(c *gin.Context)
}

type liquidationHandlerImpl struct {
	usecase usecase.LiquidationUsecase
}

func NewLiquidationHandler(u usecase.LiquidationUsecase) LiquidationHandler {
	return &liquidationHandlerImpl{usecase: u}
}
func (h *liquidationHandlerImpl) CreateLiquidation(c *gin.Context) {
	data, err := h.bindCreateLiquidation(c)
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

	err = h.usecase.CreateLiquidation(data, userResponse.ID, userResponse.GroupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.Status(http.StatusOK)
}
func (h *liquidationHandlerImpl) DeleteLiquidation(c *gin.Context) {

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

	err = h.usecase.DeleteLiquidation(id, userResponse.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.Status(http.StatusOK)
}

func (h *liquidationHandlerImpl) GetAllLiquidation(c *gin.Context) {
	//ログインデータ取得
	userResponse, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetAllLiquidation(userResponse.GroupID)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *liquidationHandlerImpl) bindCreateLiquidation(c *gin.Context) (entity.LiquidationCreate, error) {
	liquidationCreate := entity.LiquidationCreate{}
	if err := c.BindJSON(&liquidationCreate); err != nil {
		return liquidationCreate, err
	}

	return liquidationCreate, nil
}
func (h *liquidationHandlerImpl) getID(c *gin.Context) (uint, error) {
	idstr := c.Param("id")
	val, err := strconv.ParseUint(idstr, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(val), nil
}
