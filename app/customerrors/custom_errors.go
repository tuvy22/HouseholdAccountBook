package customerrors

type ErrorCode string

const (
	ErrGroupUpdateFailed  ErrorCode = "already_in_group"
	ErrInvalidCredentials ErrorCode = "invalid_credentials"
	ErrInvalidLogin       ErrorCode = "invalid_login"
	ErrInternalServer     ErrorCode = "internal_server_error"
)

var errorMessages = map[ErrorCode]string{
	ErrGroupUpdateFailed:  "すでに所属するグループへの加入不可",
	ErrInvalidCredentials: "認証失敗",
	ErrInvalidLogin:       "ログイン失敗",
	ErrInternalServer:     "サーバーエラー",
}

type CustomError struct {
	Code    ErrorCode
	Message string
}

func (e *CustomError) Error() string {
	return e.Message
}

func NewCustomError(code ErrorCode) *CustomError {
	msg, exists := errorMessages[code]
	if !exists {
		msg = "予期しないエラー"
	}
	return &CustomError{
		Code:    code,
		Message: msg,
	}
}
