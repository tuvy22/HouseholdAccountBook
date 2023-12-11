package customvalidator

import (
	"github.com/go-playground/validator/v10"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
)

type IncomeAndExpenseValidator interface {
	IncomeAndExpenseValidate(incomeAndExpense entity.IncomeAndExpense) error
}

type incomeAndExpenseValidatorImpl struct {
	dataValidate *validator.Validate
}

func NewIncomeAndExpenseValidator(dataValidate *validator.Validate) IncomeAndExpenseValidator {
	return &incomeAndExpenseValidatorImpl{dataValidate: dataValidate}

}

func (v *incomeAndExpenseValidatorImpl) IncomeAndExpenseValidate(incomeAndExpense entity.IncomeAndExpense) error {

	valvalidate := entity.IncomeAndExpenseValidate{
		Category: incomeAndExpense.Category,
		Amount:   incomeAndExpense.Amount,
		Memo:     incomeAndExpense.Memo,
		Date:     incomeAndExpense.Date,
	}

	err := v.dataValidate.Struct(valvalidate)
	if err != nil {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	for _, bu := range incomeAndExpense.BillingUsers {
		valvalidateBu := entity.IncomeAndExpenseBillingUserValidate{
			Amount: bu.Amount,
		}
		err := v.dataValidate.Struct(valvalidateBu)
		if err != nil {
			return customerrors.NewCustomError(customerrors.ErrBadRequest)
		}
	}

	return nil

}
