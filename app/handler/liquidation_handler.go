package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type LiquidationHandler interface {
	CreateLiquidation(c *gin.Context)
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

func (h *liquidationHandlerImpl) bindCreateLiquidation(c *gin.Context) (entity.LiquidationCreate, error) {
	liquidationCreate := entity.LiquidationCreate{}
	if err := c.BindJSON(&liquidationCreate); err != nil {
		return liquidationCreate, err
	}

	return liquidationCreate, nil
}
