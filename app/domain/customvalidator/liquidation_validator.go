package customvalidator

import (
	"github.com/go-playground/validator/v10"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
)

type LiquidationValidator interface {
	LiquidationCreateValidate(incomeAndExpense entity.LiquidationCreate) error
}

type liquidationValidatorImpl struct {
	dataValidate *validator.Validate
}

func NewLiquidationValidator(dataValidate *validator.Validate) LiquidationValidator {
	return &liquidationValidatorImpl{dataValidate: dataValidate}

}

func (v *liquidationValidatorImpl) LiquidationCreateValidate(liquidationCreate entity.LiquidationCreate) error {

	err := v.dataValidate.Struct(liquidationCreate)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}

	return nil

}
