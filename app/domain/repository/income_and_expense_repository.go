package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type IncomeAndExpenseRepository interface {
	GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense, registerUserIDs []string) error
	GetAllIncomeAndExpenseWithBillingUser(data *[]entity.IncomeAndExpense, registerUserIDs []string) error
	GetIncomeAndExpense(id uint, incomeAndExpense *entity.IncomeAndExpense) error
	CreateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error
	CreateIncomeAndExpenseWithBillingUser(data *entity.IncomeAndExpense) error
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
	if err := r.DB.Where("register_user_id IN ?", registerUserIDs).Order("Date desc, id desc").Find(&incomeAndExpenses).Error; err != nil {
		return err
	}
	return nil
}
func (r *incomeAndExpenseRepositoryImpl) GetAllIncomeAndExpenseWithBillingUser(data *[]entity.IncomeAndExpense, registerUserIDs []string) error {
	if err := r.DB.Preload("BillingUsers").Where("register_user_id IN ?", registerUserIDs).Order("Date desc, id desc").Find(data).Error; err != nil {
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
func (r *incomeAndExpenseRepositoryImpl) CreateIncomeAndExpenseWithBillingUser(data *entity.IncomeAndExpense) error {
	// トランザクション開始
	tx := r.DB.Begin()

	// 親モデル（IncomeAndExpense）を先に保存
	if err := tx.Create(&data).Error; err != nil {
		tx.Rollback() // エラーが発生した場合はロールバック
		return err
	}

	// IncomeAndExpenseID を子モデルにセット
	for i := range data.BillingUsers {
		data.BillingUsers[i].IncomeAndExpenseID = data.ID
	}

	// 子モデル（BillingUserのスライス）を保存
	if err := tx.Create(&data.BillingUsers).Error; err != nil {
		tx.Rollback() // エラーが発生した場合はロールバック
		return err
	}

	// トランザクションをコミット
	return tx.Commit().Error
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
