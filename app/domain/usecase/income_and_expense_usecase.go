package usecase

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

type IncomeAndExpenseUsecase interface {
	GetIncomeAndExpenses() (*[]entity.IncomeAndExpense, error)
}

type incomeAndExpenseUsecaseImpl struct {
	repo repository.IncomeAndExpenseRepository
}

func NewIncomeAndExpenseUsecase(repo repository.IncomeAndExpenseRepository) IncomeAndExpenseUsecase {
	return &incomeAndExpenseUsecaseImpl{repo: repo}
}

func (u *incomeAndExpenseUsecaseImpl) GetIncomeAndExpenses() (*[]entity.IncomeAndExpense, error) {
	return u.repo.GetIncomeAndExpenses()
}
