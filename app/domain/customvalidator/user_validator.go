package customvalidator

import (
	"regexp"

	"github.com/go-playground/validator/v10"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
)

type UserValidator interface {
	UserCreateValidate(user entity.UserCreate) error
	UserUpdateValidate(user entity.UserUpdate) error
}

type userValidatorImpl struct {
	dataValidate *validator.Validate
}

func NewUserValidator(dataValidate *validator.Validate) UserValidator {
	return &userValidatorImpl{dataValidate: dataValidate}

}

func (v *userValidatorImpl) UserCreateValidate(user entity.UserCreate) error {

	err := v.dataValidate.RegisterValidation("password", v.passwordValidation)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}

	err = v.dataValidate.Struct(user)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	return nil

}

func (v *userValidatorImpl) passwordValidation(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	// 英字、数字、記号を含むかどうかをチェック
	hasLetter := regexp.MustCompile(`[A-Za-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`\d`).MatchString(password)
	hasSymbol := regexp.MustCompile(`[^A-Za-z\d]`).MatchString(password)

	return hasLetter && hasNumber && hasSymbol
}

func (v *userValidatorImpl) UserUpdateValidate(user entity.UserUpdate) error {

	err := v.dataValidate.Struct(user)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	return nil

}
