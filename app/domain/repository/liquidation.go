package repository

import (
	"time"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type Liquidation interface {
	GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense, registerUserIDs []string) error
}

type liquidationRepositoryImpl struct {
	DB *gorm.DB
}

func NewLiquidationRepository(db *gorm.DB) IncomeAndExpenseRepository {
	return &incomeAndExpenseRepositoryImpl{DB: db}
}

func (r *incomeAndExpenseRepositoryImpl) GetLiquidations(fromDate time.Time, toDate time.Time, incomeAndExpenses *[]entity.IncomeAndExpense, registerUserIDs []string, billingUserIDs []string) error {
	if err := r.DB.Preload("BillingUsers").Where("register_user_id IN ?", registerUserIDs).Order("Date desc, id desc").Find(incomeAndExpenses).Error; err != nil {
		return err
	}
	return nil
}
