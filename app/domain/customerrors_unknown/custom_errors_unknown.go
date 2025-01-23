package customerrors_unknown

import (
	"runtime/debug"
)

type CustomErrorUnknown struct {
	Err   error
	Stack string
}

func (e *CustomErrorUnknown) Error() string {
	if e.Err == nil {
		return ""
	}
	return "" //fmt.Sprintf("Error: %v, Stack: %s", e.Err, e.Stack) // エラーメッセージとスタックトレースを表示
}

func NewCustomErrorUnknown(err error) *CustomErrorUnknown {
	return &CustomErrorUnknown{
		Err:   err,
		Stack: string(debug.Stack()),
	}
}

// // エラーをラップする
// func (e *CustomErrorSystem) WithError(err error) *CustomErrorSystem {
// 	e.Err = err
// 	return e
// }

// // スタックトレースを追加する
// func (e *CustomErrorSystem) WithStack(stack string) *CustomErrorSystem {
// 	e.Stack = stack
// 	return e
// }
