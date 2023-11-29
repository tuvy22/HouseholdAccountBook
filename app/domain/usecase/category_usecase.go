package usecase

import (
	"fmt"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

type CategoryUsecase interface {
	GetAllIncomeCategory(groupID uint) ([]entity.CategoryResponse, error)
	GetAllExpenseCategory(groupID uint) ([]entity.CategoryResponse, error)
	CreateCategory(category entity.Category, groupID uint) error
	DeleteCategory(id uint, groupID uint) error
}

type categoryUsecaseImpl struct {
	repo repository.CategoryRepository
}

func NewCategoryUsecase(repo repository.CategoryRepository) CategoryUsecase {
	return &categoryUsecaseImpl{repo: repo}
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

func (u *categoryUsecaseImpl) CreateCategory(category entity.Category, groupID uint) error {

	err := u.validateGroupID(category, groupID, ErrFailedCreate)
	if err != nil {
		return err
	}
	err = u.repo.CreateCategory(&category)
	if err != nil {
		return err
	}
	return nil
}

func (u *categoryUsecaseImpl) DeleteCategory(id uint, groupID uint) error {
	category := entity.Category{}
	u.repo.GetCategory(id, &category)

	err := u.validateGroupID(category, groupID, ErrFailedDelete)
	if err != nil {
		return err
	}

	return u.repo.DeleteCategory(id)
}

func (u *categoryUsecaseImpl) validateGroupID(category entity.Category, groupID uint, errMessage string) error {
	if category.GroupID != groupID {
		return fmt.Errorf(errMessage)
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
