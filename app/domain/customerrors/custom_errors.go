package customerrors

type ErrorCode string

const (
	//すでに所属するグループへの加入不可
	ErrGroupUpdateFailed ErrorCode = "already_in_group"
	//認証失敗
	ErrInvalidCredentials ErrorCode = "invalid_credentials"
	//ログイン失敗
	ErrInvalidLogin ErrorCode = "invalid_login"
	//セッションなし
	ErrNoSession ErrorCode = "no_session"
	//リクエスト不正
	ErrBadRequest ErrorCode = "bad_request"
	//その他サーバーエラー
	ErrInternalServer ErrorCode = "internal_server_error"
)

type CustomError struct {
	Code    ErrorCode
	Message string
}

func (e *CustomError) Error() string {
	return string(e.Code)
}

func NewCustomError(code ErrorCode) *CustomError {
	return &CustomError{
		Code: code,
	}
}
