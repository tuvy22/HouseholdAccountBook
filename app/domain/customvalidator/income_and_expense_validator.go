package customvalidator

import (
	"github.com/go-playground/validator/v10"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
)

type IncomeAndExpenseValidator interface {
	IncomeAndExpenseCreateValidate(incomeAndExpenseCreate entity.IncomeAndExpenseCreate) error
	IncomeAndExpenseUpdateValidate(incomeAndExpenseUpdate entity.IncomeAndExpenseUpdate) error
}

type incomeAndExpenseValidatorImpl struct {
	dataValidate *validator.Validate
}

func NewIncomeAndExpenseValidator(dataValidate *validator.Validate) IncomeAndExpenseValidator {
	return &incomeAndExpenseValidatorImpl{dataValidate: dataValidate}

}

func (v *incomeAndExpenseValidatorImpl) IncomeAndExpenseCreateValidate(incomeAndExpenseCreate entity.IncomeAndExpenseCreate) error {

	err := v.dataValidate.Struct(incomeAndExpenseCreate)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	err = v.billingUsersValidate(incomeAndExpenseCreate.BillingUsers)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}

	return nil

}
func (v *incomeAndExpenseValidatorImpl) IncomeAndExpenseUpdateValidate(incomeAndExpenseUpdate entity.IncomeAndExpenseUpdate) error {

	err := v.dataValidate.Struct(incomeAndExpenseUpdate)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	err = v.billingUsersValidate(incomeAndExpenseUpdate.BillingUsers)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}

	return nil
}

func (v *incomeAndExpenseValidatorImpl) billingUsersValidate(billingUsers []entity.IncomeAndExpenseBillingUser) error {

	for _, bu := range billingUsers {
		valvalidateBu := entity.IncomeAndExpenseBillingUserValidate{
			Amount: bu.Amount,
		}
		err := v.dataValidate.Struct(valvalidateBu)
		if err != nil {
			return err
		}
	}

	return nil
}
