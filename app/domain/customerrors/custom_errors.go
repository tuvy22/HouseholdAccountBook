package customerrors

type ErrorCode string

const (
	//すでに同じユーザーIDで利用しているユーザーがいます。
	ErrRegisteredUserID ErrorCode = "registered_user_id"
	//すでに所属するグループへの加入不可
	ErrAlreadyInGroup ErrorCode = "already_in_group"
	//カテゴリーが０件は不可
	ErrCategorysLenZero ErrorCode = "categorys_len_zero"
	//ユーザー別の立替額が合計額と一致しない
	ErrBillUserExpenseUnMatch ErrorCode = "bill_user_expense_un_match"
	//変更前のパスワードでの認証が成功しない
	ErrPrePasswordCredentials ErrorCode = "pre_password_credentials"
	//未精算データがあり退会できない
	ErrUnLiquidationNoUserDelete ErrorCode = "un_liquidation_no_user_delete"
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
	Code ErrorCode
}

func (e *CustomError) Error() string {
	return string(e.Code)
}

func NewCustomError(code ErrorCode) *CustomError {
	return &CustomError{
		Code: code,
	}
}
