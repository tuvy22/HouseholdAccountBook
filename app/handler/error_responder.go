package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/customlogger"
)

func errorResponder(c *gin.Context, paramErr error) {
	var customErr *customerrors.CustomError
	var statusCode int

	if errors.As(paramErr, &customErr) {
		// カスタムエラーの場合、エラーコードに基づいてステータスコードを設定
		switch customErr.Code {
		case customerrors.ErrRegisteredUserID:
			statusCode = http.StatusConflict
		case customerrors.ErrAlreadyInGroup:
			statusCode = http.StatusConflict
		case customerrors.ErrCategorysLenZero:
			statusCode = http.StatusBadRequest
		case customerrors.ErrBillUserExpenseUnMatch:
			statusCode = http.StatusBadRequest
		case customerrors.ErrPrePasswordCredentials:
			statusCode = http.StatusUnauthorized
		case customerrors.ErrUnLiquidationNoUserDelete:
			statusCode = http.StatusPreconditionFailed
		case customerrors.ErrSingleUserOutGroup:
			statusCode = http.StatusBadRequest
		case customerrors.ErrMultiUserLiquidation:
			statusCode = http.StatusPreconditionFailed
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
	userID := ""
	loginUser, err := GetLoginUser(c)
	if err != nil {
		userID = loginUser.ID
	}

	//ログ出力
	logger := customlogger.NewLogrusLogger()
	if statusCode >= http.StatusInternalServerError {
		logger.Error(userID, paramErr)
	} else {
		logger.Warn(userID, paramErr.Error())
	}

	// エラーレスポンスをクライアントに返す
	c.JSON(statusCode, gin.H{
		"code": string(customErr.Code),
	})
}
