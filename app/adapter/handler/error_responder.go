package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/customerrors"
)

func errorResponder(c *gin.Context, err error) {
	var customErr *customerrors.CustomError
	var statusCode int

	if errors.As(err, &customErr) {
		// カスタムエラーの場合、エラーコードに基づいてステータスコードを設定
		switch customErr.Code {
		case customerrors.ErrGroupUpdateFailed:
			statusCode = http.StatusConflict
		case customerrors.ErrInvalidCredentials:
			statusCode = http.StatusUnauthorized
		case customerrors.ErrInvalidLogin:
			statusCode = http.StatusUnauthorized
		default:
			statusCode = http.StatusInternalServerError
		}
	} else {
		// 未知のエラーの場合、500 Internal Server Error を返す
		statusCode = http.StatusInternalServerError
	}

	// エラーレスポンスをクライアントに返す
	c.JSON(statusCode, gin.H{
		"error": customErr.Message,
		"code":  string(customErr.Code),
	})
}
