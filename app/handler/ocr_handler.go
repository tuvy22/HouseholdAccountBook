package handler

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/usecase"
)

type OcrHandler interface {
	GetTotalAndStoreFromReceipt(c *gin.Context)
}

type ocrHandlerImpl struct {
	usecase usecase.OcrUsecase
}

func NewOcrHandler(u usecase.OcrUsecase) OcrHandler {
	return &ocrHandlerImpl{usecase: u}
}

func (h *ocrHandlerImpl) GetTotalAndStoreFromReceipt(c *gin.Context) {

	// フォームからファイルを取得
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		errorResponder(c, err)
		return
	}
	defer file.Close()

	// ファイルの内容を読み取り、バイトスライスに変換
	imageBytes, err := io.ReadAll(file)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetTotalAndStoreFromReceipt(imageBytes)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)

}
