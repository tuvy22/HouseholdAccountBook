package repository

import (
	"time"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type IncomeAndExpenseRepository interface {
	GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense, registerUserIDs []string) error
	GetIncomeAndExpenseLiquidations(incomeAndExpenses *[]entity.IncomeAndExpense, fromDate time.Time, toDate time.Time, registerUserID string, billingUserID string) error
	GetIncomeAndExpense(id uint, incomeAndExpense *entity.IncomeAndExpense) error
	CreateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error
	UpdateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error
	DeleteIncomeAndExpense(id uint) error

	GetMonthlyTotal(monthlyTotals *[]entity.IncomeAndExpenseMonthlyTotal, registerUserIDs []string) error
	GetMonthlyCategory(monthlyCategorys *[]entity.IncomeAndExpenseMonthlyCategory, yearMonth string, registerUserIDs []string, isMinus bool) error
}

type incomeAndExpenseRepositoryImpl struct {
	DB *gorm.DB
}

func NewIncomeAndExpenseRepository(db *gorm.DB) IncomeAndExpenseRepository {
	return &incomeAndExpenseRepositoryImpl{DB: db}
}

func (r *incomeAndExpenseRepositoryImpl) GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense, registerUserIDs []string) error {
	if err := r.DB.Preload("BillingUsers").Where("register_user_id IN ?", registerUserIDs).Order("Date desc, id desc").Find(&incomeAndExpenses).Error; err != nil {
		return err
	}
	return nil
}

func (r *incomeAndExpenseRepositoryImpl) GetIncomeAndExpenseLiquidations(incomeAndExpenses *[]entity.IncomeAndExpense, fromDate time.Time, toDate time.Time, registerUserID string, billingUserID string) error {

	query := r.DB.Model(&entity.IncomeAndExpense{}).
		Joins("JOIN income_and_expense_billing_users ON income_and_expenses.id = income_and_expense_billing_users.income_and_expense_id").
		Where("income_and_expenses.register_user_id = ?", registerUserID).
		Where("income_and_expense_billing_users.user_id = ?", billingUserID).
		Where("income_and_expense_billing_users.liquidation_id = ?", 0)

	// 日付範囲の条件を適用
	if !fromDate.IsZero() {
		query = query.Where("income_and_expenses.date >= ?", fromDate)
	}
	if !toDate.IsZero() {
		query = query.Where("income_and_expenses.date <= ?", toDate)
	}
	// グループ化して重複を除外
	query = query.Group("income_and_expenses.id")

	// 結果を取得
	if err := query.Find(incomeAndExpenses).Error; err != nil {
		return err
	}

	// それぞれのIncomeAndExpenseに対して、条件に一致するBillingUsersを取得
	for i, _ := range *incomeAndExpenses {
		err := r.DB.Model(&entity.IncomeAndExpenseBillingUser{}).
			Where("income_and_expense_id = ?", (*incomeAndExpenses)[i].ID).
			Find(&(*incomeAndExpenses)[i].BillingUsers).Error

		if err != nil {
			return err
		}
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
func (r *incomeAndExpenseRepositoryImpl) GetMonthlyTotal(monthlyTotals *[]entity.IncomeAndExpenseMonthlyTotal, registerUserIDs []string) error {
	sql := `
	SELECT 
		t1.year_month,
		SUM(t2.monthTotalAmount) AS 'total_amount'
	FROM
		(SELECT 
			DATE_FORMAT(date, '%Y-%m') as 'year_month',
			SUM(amount) as 'monthTotalAmount'
		FROM income_and_expenses
		WHERE register_user_id IN ?
		GROUP BY DATE_FORMAT(date, '%Y-%m')) t1
	JOIN 
		(SELECT 
			DATE_FORMAT(date, '%Y-%m') as 'year_month',
			SUM(amount) as 'monthTotalAmount'
		FROM income_and_expenses
		WHERE register_user_id IN ?
		GROUP BY DATE_FORMAT(date, '%Y-%m')) t2
	ON t1.year_month >= t2.year_month
	GROUP BY t1.year_month
	ORDER BY t1.year_month;
	`

	if err := r.DB.Raw(sql, registerUserIDs, registerUserIDs).Scan(&monthlyTotals).Error; err != nil {
		return err
	}

	return nil
}

// 月ごとのカテゴリー別の集計
func (r *incomeAndExpenseRepositoryImpl) GetMonthlyCategory(monthlyCategorys *[]entity.IncomeAndExpenseMonthlyCategory, yearMonth string, registerUserIDs []string, isMinus bool) error {

	queryBuilder := r.DB.Table("income_and_expenses").
		Select(`DATE_FORMAT(date, '%Y-%m') as 'year_month', category, ABS(SUM(amount)) as 'category_amount'`).
		Where("DATE_FORMAT(date, '%Y-%m') = ? AND register_user_id IN ?", yearMonth, registerUserIDs).
		Group("DATE_FORMAT(date, '%Y-%m'), category").
		Order("category_amount desc, category desc")

	if isMinus {
		queryBuilder = queryBuilder.Where("amount < ?", 0)
	} else {
		queryBuilder = queryBuilder.Where("amount >= ?", 0)
	}
	if err := queryBuilder.Find(&monthlyCategorys).Error; err != nil {
		return err
	}

	return nil
}
