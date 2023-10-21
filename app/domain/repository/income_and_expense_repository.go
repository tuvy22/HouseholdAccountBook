package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type IncomeAndExpenseRepository interface {
	GetIncomeAndExpenses(*[]entity.IncomeAndExpense) error
}

type incomeAndExpenseRepositoryImpl struct {
	DB *gorm.DB
}

func NewIncomeAndExpenseRepository(db *gorm.DB) IncomeAndExpenseRepository {
	return &incomeAndExpenseRepositoryImpl{DB: db}
}

func (r *incomeAndExpenseRepositoryImpl) GetIncomeAndExpenses(incomeAndExpense *[]entity.IncomeAndExpense) error {

	if err := r.DB.Order("Date desc, sort_at desc").Find(&incomeAndExpense).Error; err != nil {
		return err
	}
	return nil
}