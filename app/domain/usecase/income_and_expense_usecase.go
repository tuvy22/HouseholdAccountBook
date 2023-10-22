package usecase

import (
	"fmt"
	"time"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

const (
	ErrFailedCreate = "failed create"
	ErrFailedUpdate = "failed update"
)

type IncomeAndExpenseUsecase interface {
	GetAllIncomeAndExpense() ([]entity.IncomeAndExpense, error)
	CreateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error
	UpdateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error
	DeleteIncomeAndExpense(id uint) error
}

type incomeAndExpenseUsecaseImpl struct {
	repo repository.IncomeAndExpenseRepository
}

func NewIncomeAndExpenseUsecase(repo repository.IncomeAndExpenseRepository) IncomeAndExpenseUsecase {
	return &incomeAndExpenseUsecaseImpl{repo: repo}
}

func (u *incomeAndExpenseUsecaseImpl) GetAllIncomeAndExpense() ([]entity.IncomeAndExpense, error) {
	incomeAndExpenses := []entity.IncomeAndExpense{}

	err := u.repo.GetAllIncomeAndExpense(&incomeAndExpenses)
	if err != nil {
		return incomeAndExpenses, err
	}

	return incomeAndExpenses, nil
}
func (u *incomeAndExpenseUsecaseImpl) CreateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error {

	err := u.validateUserID(incomeAndExpense, userId, ErrFailedCreate)
	if err != nil {
		return err
	}

	u.setTimestampIfEmpty(&incomeAndExpense)

	return u.repo.CreateIncomeAndExpense(&incomeAndExpense)
}
func (u *incomeAndExpenseUsecaseImpl) UpdateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error {
	preIncomeAndExpense := entity.IncomeAndExpense{}
	err := u.repo.GetIncomeAndExpense(incomeAndExpense.ID, &preIncomeAndExpense)
	if err != nil {
		return err
	}

	err = u.validateUserID(preIncomeAndExpense, userId, ErrFailedUpdate)
	if err != nil {
		return err
	}

	u.setTimestampIfEmpty(&incomeAndExpense)
	return u.repo.UpdateIncomeAndExpense(&incomeAndExpense)
}
func (u *incomeAndExpenseUsecaseImpl) DeleteIncomeAndExpense(id uint) error {

	return u.repo.DeleteIncomeAndExpense(id)
}
func (u *incomeAndExpenseUsecaseImpl) setTimestampIfEmpty(incomeAndExpense *entity.IncomeAndExpense) {
	if incomeAndExpense.SortAt == "" {
		incomeAndExpense.SortAt = time.Now().Format(time.RFC3339)
	}
}

func (u *incomeAndExpenseUsecaseImpl) validateUserID(incomeAndExpense entity.IncomeAndExpense, userId string, errMessage string) error {
	if incomeAndExpense.RegisterUserID != userId {
		return fmt.Errorf(errMessage)
	}
	return nil
}
