package customvalidator

import (
	"github.com/go-playground/validator/v10"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
)

type GroupValidator interface {
	InitialAmountValidate(initialAmount entity.InitialAmount) error
}

type groupValidatorImpl struct {
	dataValidate *validator.Validate
}

func NewGroupValidator(dataValidate *validator.Validate) GroupValidator {
	return &groupValidatorImpl{dataValidate: dataValidate}

}

func (v *groupValidatorImpl) InitialAmountValidate(initialAmount entity.InitialAmount) error {

	err := v.dataValidate.Struct(initialAmount)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}

	return nil

}
