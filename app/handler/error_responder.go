package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/logger"
)

func errorResponder(c *gin.Context, paramErr error) {
	var customErr *customerrors.CustomError
	var statusCode int

	if errors.As(paramErr, &customErr) {
		// カスタムエラーの場合、エラーコードに基づいてステータスコードを設定
		switch customErr.Code {
		case customerrors.ErrAlreadyInGroup:
			statusCode = http.StatusConflict
		case customerrors.ErrCategorysLenZero:
			statusCode = http.StatusBadRequest
		case customerrors.ErrInvalidCredentials:
			statusCode = http.StatusUnauthorized
		case customerrors.ErrInvalidLogin:
			statusCode = http.StatusUnauthorized
		case customerrors.ErrNoSession:
			statusCode = http.StatusUnauthorized
		case customerrors.ErrBadRequest:
			statusCode = http.StatusBadRequest
		default:
			statusCode = http.StatusInternalServerError
		}
	} else {
		// 未知のエラーの場合、500 Internal Server Error を返す
		statusCode = http.StatusInternalServerError
	}

	//ログインデータ取得
	loginUser, err := GetLoginUser(c)
	if err != nil {
		errorResponder(c, paramErr)
		return
	}

	//ログ出力
	logger := logger.NewLogrusLogger()
	if statusCode >= http.StatusInternalServerError {
		logger.Error(loginUser.ID, paramErr)
	} else {
		logger.Warn(loginUser.ID, paramErr.Error())
	}

	// エラーレスポンスをクライアントに返す
	c.JSON(statusCode, gin.H{
		"code": string(customErr.Code),
	})
}
