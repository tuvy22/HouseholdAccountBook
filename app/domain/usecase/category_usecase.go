package usecase

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/customvalidator"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

type CategoryUsecase interface {
	GetAllIncomeCategory(groupID uint) ([]entity.CategoryResponse, error)
	GetAllExpenseCategory(groupID uint) ([]entity.CategoryResponse, error)
	ReplaceAllCategory(categorys []entity.Category, isExpense bool, groupID uint) error
}

type categoryUsecaseImpl struct {
	repo              repository.CategoryRepository
	categoryValidator customvalidator.CategoryValidator
}

func NewCategoryUsecase(repo repository.CategoryRepository, categoryValidator customvalidator.CategoryValidator) CategoryUsecase {
	return &categoryUsecaseImpl{repo: repo, categoryValidator: categoryValidator}
}

func (u *categoryUsecaseImpl) GetAllIncomeCategory(groupID uint) ([]entity.CategoryResponse, error) {

	return u.getAllCategory(groupID, false)
}

func (u *categoryUsecaseImpl) GetAllExpenseCategory(groupID uint) ([]entity.CategoryResponse, error) {

	return u.getAllCategory(groupID, true)
}

func (u *categoryUsecaseImpl) getAllCategory(groupID uint, isExpense bool) ([]entity.CategoryResponse, error) {
	categorys := []entity.Category{}
	err := u.repo.GetAllCategory(&categorys, groupID, isExpense)
	if err != nil {
		return u.convertToCategorys(categorys), err
	}
	return u.convertToCategorys(categorys), nil
}

func (u *categoryUsecaseImpl) ReplaceAllCategory(categorys []entity.Category, isExpense bool, groupID uint) error {

	err := u.checkCategorysLenZero(categorys)
	if err != nil {
		return err
	}

	err = u.checkGroupID(categorys, groupID)
	if err != nil {
		return err
	}

	err = u.checkExpense(categorys, isExpense)
	if err != nil {
		return err
	}

	err = u.categoryValidator.CategoryReplaceAllValidate(categorys)
	if err != nil {
		return err
	}

	err = u.repo.DeleteAllCategory(isExpense, groupID)
	if err != nil {
		return err
	}
	for _, category := range categorys {
		err = u.repo.CreateCategory(&category)
		if err != nil {
			return err
		}
	}
	return nil
}
func (u *categoryUsecaseImpl) checkCategorysLenZero(categorys []entity.Category) error {

	if len(categorys) == 0 {
		return customerrors.NewCustomError(customerrors.ErrCategorysLenZero)
	}

	return nil
}

func (u *categoryUsecaseImpl) checkGroupID(categorys []entity.Category, groupID uint) error {
	for _, category := range categorys {
		if category.GroupID != groupID {
			return customerrors.NewCustomError(customerrors.ErrBadRequest)
		}
	}
	return nil
}
func (u *categoryUsecaseImpl) checkExpense(categorys []entity.Category, isExpense bool) error {
	for _, category := range categorys {
		if category.IsExpense != isExpense {
			return customerrors.NewCustomError(customerrors.ErrBadRequest)
		}
	}
	return nil
}

func (u *categoryUsecaseImpl) convertToCategorys(categorys []entity.Category) []entity.CategoryResponse {

	resultResponses := make([]entity.CategoryResponse, 0, len(categorys))

	for _, category := range categorys {

		response := entity.CategoryResponse{
			ID:        category.ID,
			Name:      category.Name,
			GroupID:   category.GroupID,
			IsExpense: category.IsExpense,
		}
		resultResponses = append(resultResponses, response)
	}

	return resultResponses

}
