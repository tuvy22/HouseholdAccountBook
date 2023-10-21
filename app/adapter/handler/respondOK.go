package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ResponsedOKHandler interface {
	ResponsedOK(c *gin.Context)
}

type responsedOKHandlerImpl struct {
}

func NewResponsedOKHandler() ResponsedOKHandler {
	return &responsedOKHandlerImpl{}
}

func (h *responsedOKHandlerImpl) ResponsedOK(c *gin.Context) {
	c.JSON(http.StatusOK, "")
}
