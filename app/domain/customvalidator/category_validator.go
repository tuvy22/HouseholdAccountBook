package customvalidator

import (
	"github.com/go-playground/validator/v10"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
)

type CategoryValidator interface {
	CategoryReplaceAllValidate(categorys []entity.Category) error
}

type categoryValidatorImpl struct {
	dataValidate *validator.Validate
}

func NewCategoryValidator(dataValidate *validator.Validate) CategoryValidator {
	return &categoryValidatorImpl{dataValidate: dataValidate}

}

func (v *categoryValidatorImpl) CategoryReplaceAllValidate(categorys []entity.Category) error {

	for _, category := range categorys {

		valvalidate := entity.CategoryValidate{
			Name: category.Name,
		}

		err := v.dataValidate.Struct(valvalidate)
		if err != nil {
			return customerrors.NewCustomError(customerrors.ErrBadRequest)
		}
	}

	return nil

}
