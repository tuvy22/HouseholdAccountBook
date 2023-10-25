package usecase

import "errors"

var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrInternalServer = errors.New("internal server error")
