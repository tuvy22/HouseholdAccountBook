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

	MonthlyTotal(monthlyTotals *[]entity.IncomeAndExpenseMonthlyTotal) error
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
func (r *incomeAndExpenseRepositoryImpl) MonthlyTotal(monthlyTotals *[]entity.IncomeAndExpenseMonthlyTotal) error {
	sql := `
    SELECT 
        t1.year_month,
        SUM(t2.monthTotalAmount) AS 'total_amount'
    FROM
        (SELECT 
            DATE_FORMAT(date, '%Y-%m') as 'year_month',
            SUM(amount) as 'monthTotalAmount'
        FROM income_and_expenses
        GROUP BY DATE_FORMAT(date, '%Y-%m')) t1
    JOIN 
        (SELECT 
            DATE_FORMAT(date, '%Y-%m') as 'year_month',
            SUM(amount) as 'monthTotalAmount'
        FROM income_and_expenses
        GROUP BY DATE_FORMAT(date, '%Y-%m')) t2
    ON t1.year_month >= t2.year_month
    GROUP BY t1.year_month
    ORDER BY t1.year_month;
	`

	if err := r.DB.Raw(sql).Scan(&monthlyTotals).Error; err != nil {
		return err
	}

	return nil
}
