package usecase

import (
	"fmt"

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

	MonthlyTotal() ([]entity.MonthlyTotal, error)
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

	return u.repo.UpdateIncomeAndExpense(&incomeAndExpense)
}
func (u *incomeAndExpenseUsecaseImpl) DeleteIncomeAndExpense(id uint) error {

	return u.repo.DeleteIncomeAndExpense(id)
}
func (u *incomeAndExpenseUsecaseImpl) MonthlyTotal() ([]entity.MonthlyTotal, error) {
	monthlyTotals := []entity.MonthlyTotal{}

	err := u.repo.MonthlyTotal(&monthlyTotals)
	if err != nil {
		return monthlyTotals, err
	}

	return monthlyTotals, nil
}

func (u *incomeAndExpenseUsecaseImpl) validateUserID(incomeAndExpense entity.IncomeAndExpense, userId string, errMessage string) error {
	if incomeAndExpense.RegisterUserID != userId {
		return fmt.Errorf(errMessage)
	}
	return nil
}
