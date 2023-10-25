package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type IncomeAndExpenseRepository interface {
	GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense) error
	GetIncomeAndExpense(id uint, incomeAndExpense *entity.IncomeAndExpense) error
	CreateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error
	UpdateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error
	DeleteIncomeAndExpense(id uint) error

	MonthlyTotal(monthlyTotals *[]entity.MonthlyTotal) error
}

type incomeAndExpenseRepositoryImpl struct {
	DB *gorm.DB
}

func NewIncomeAndExpenseRepository(db *gorm.DB) IncomeAndExpenseRepository {
	return &incomeAndExpenseRepositoryImpl{DB: db}
}

func (r *incomeAndExpenseRepositoryImpl) GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense) error {

	if err := r.DB.Order("Date desc, id desc").Find(&incomeAndExpenses).Error; err != nil {
		return err
	}
	return nil
}
func (r *incomeAndExpenseRepositoryImpl) GetIncomeAndExpense(id uint, incomeAndExpense *entity.IncomeAndExpense) error {

	if err := r.DB.Where("id = ?", id).First(&incomeAndExpense).Error; err != nil {
		return err
	}
	return nil
}

func (r *incomeAndExpenseRepositoryImpl) CreateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error {

	if err := r.DB.Create(&incomeAndExpense).Error; err != nil {
		return err
	}
	return nil
}
func (r *incomeAndExpenseRepositoryImpl) UpdateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error {

	if err := r.DB.Save(&incomeAndExpense).Error; err != nil {
		return err
	}
	return nil
}
func (r *incomeAndExpenseRepositoryImpl) DeleteIncomeAndExpense(id uint) error {

	if err := r.DB.Where("id = ?", id).Delete(&entity.IncomeAndExpense{}).Error; err != nil {
		return err
	}
	return nil
}

// 月ごとの合計
func (r *incomeAndExpenseRepositoryImpl) MonthlyTotal(monthlyTotals *[]entity.MonthlyTotal) error {

	if err := r.DB.Select("DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as total_amount").Group("DATE_FORMAT(date, '%Y-%m')").Scan(&monthlyTotals).Error; err != nil {
		return err
	}
	return nil
}
