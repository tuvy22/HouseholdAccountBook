package handler

import (
	"bytes"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"
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

	// 画像のリサイズ
	resizedImageBytes, err := resizeImage(imageBytes, 800)
	if err != nil {
		errorResponder(c, err)
		return
	}

	result, err := h.usecase.GetTotalAndStoreFromReceipt(resizedImageBytes)
	if err != nil {
		errorResponder(c, err)
		return
	}

	c.JSON(http.StatusOK, result)

}
func resizeImage(imageBytes []byte, width uint) ([]byte, error) {
	// 画像データをデコード
	img, format, err := image.Decode(bytes.NewReader(imageBytes))
	if err != nil {
		return nil, err
	}

	// 元の画像サイズを取得
	originalWidth := img.Bounds().Dx()

	// 新しい高さを計算してリサイズ
	var resizedImage image.Image
	if originalWidth > int(width) {
		resizedImage = resize.Resize(width, 0, img, resize.Lanczos3)
	} else {
		resizedImage = img
	}

	// バッファにエンコード
	buf := new(bytes.Buffer)
	switch format {
	case "jpeg":
		err = jpeg.Encode(buf, resizedImage, nil)
	case "png":
		err = png.Encode(buf, resizedImage)
	default:
		return nil, err
	}

	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}
