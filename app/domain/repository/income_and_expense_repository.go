package repository

import (
	"time"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type IncomeAndExpenseRepository interface {
	GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense, registerUserIDs []string, offset, limit int) error
	GetAllIncomeAndExpenseCount(count *int64, registerUserIDs []string) error
	GetIncomeAndExpenseLiquidations(incomeAndExpenses *[]entity.IncomeAndExpense, fromDate time.Time, toDate time.Time, registerUserID []string, billingUserID []string) error
	GetIncomeAndExpense(id uint, incomeAndExpense *entity.IncomeAndExpense) error
	CreateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error
	UpdateIncomeAndExpense(incomeAndExpense *entity.IncomeAndExpense) error
	UpdateIncomeAndExpenseUserID(oldUserID string, newUserID string) error
	DeleteIncomeAndExpense(id uint) error

	GetMonthlyTotal(monthlyTotals *[]entity.IncomeAndExpenseMonthlyTotal, userIDs []string) error
	GetMonthlyCategory(monthlyCategorys *[]entity.IncomeAndExpenseMonthlyCategory, yearMonth string, userIDs []string, isMinus bool) error
}

type incomeAndExpenseRepositoryImpl struct {
	DB *gorm.DB
}

func NewIncomeAndExpenseRepository(db *gorm.DB) IncomeAndExpenseRepository {
	return &incomeAndExpenseRepositoryImpl{DB: db}
}

func (r *incomeAndExpenseRepositoryImpl) GetAllIncomeAndExpense(incomeAndExpenses *[]entity.IncomeAndExpense, groupUserIDs []string, offset, limit int) error {
	// サブクエリ
	subQuery := r.DB.Model(&entity.IncomeAndExpenseBillingUser{}).Select("income_and_expense_id").Where("user_id IN ?", groupUserIDs)

	query := r.DB.Preload("BillingUsers").
		Order("Date desc, id desc")

	query = query.Where("id IN (?)", subQuery)

	// OffsetとLimitを条件に基づいて適用
	if offset > 0 {
		query = query.Offset(offset)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}

	// クエリの実行
	if err := query.Find(&incomeAndExpenses).Error; err != nil {
		return err
	}
	return nil
}
func (r *incomeAndExpenseRepositoryImpl) GetAllIncomeAndExpenseCount(count *int64, registerUserIDs []string) error {
	err := r.DB.Model(&entity.IncomeAndExpense{}).Where("register_user_id IN ?", registerUserIDs).Count(count).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *incomeAndExpenseRepositoryImpl) GetIncomeAndExpenseLiquidations(incomeAndExpenses *[]entity.IncomeAndExpense, fromDate time.Time, toDate time.Time, registerUserID []string, billingUserID []string) error {

	// サブクエリ
	subQuery := r.DB.Model(&entity.IncomeAndExpenseBillingUser{}).Select("income_and_expense_id").Where("user_id IN ?", billingUserID).Where("liquidation_id = ?", 0)

	query := r.DB.Model(&entity.IncomeAndExpense{}).Where("register_user_id IN ?", registerUserID)
	query = query.Where("id IN (?)", subQuery)

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

		buQuery := r.DB.Model(&entity.IncomeAndExpenseBillingUser{}).Where("income_and_expense_id = ?", (*incomeAndExpenses)[i].ID)
		if err := buQuery.Find(&(*incomeAndExpenses)[i].BillingUsers).Error; err != nil {
			return err
		}
	}

	return nil
}

func (r *incomeAndExpenseRepositoryImpl) GetIncomeAndExpense(id uint, incomeAndExpense *entity.IncomeAndExpense) error {

	if err := r.DB.Preload("BillingUsers").Where("id = ?", id).First(&incomeAndExpense).Error; err != nil {
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
	// トランザクションの開始
	tx := r.DB.Begin()

	// IncomeAndExpense の更新
	if err := tx.Save(&incomeAndExpense).Error; err != nil {
		tx.Rollback()
		return err
	}
	//一旦全削除
	if err := tx.Unscoped().Where("income_and_expense_id = ?", incomeAndExpense.ID).Delete(&entity.IncomeAndExpenseBillingUser{}).Error; err != nil {
		return err
	}

	// BillingUsers 再作成
	for _, bu := range incomeAndExpense.BillingUsers {
		bu.ID = 0
		if err := tx.Create(&bu).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// トランザクションのコミット
	return tx.Commit().Error
}
func (r *incomeAndExpenseRepositoryImpl) UpdateIncomeAndExpenseUserID(oldUserID string, newUserID string) error {
	// トランザクションの開始
	tx := r.DB.Begin()

	err := tx.Model(&entity.IncomeAndExpense{}).Where("register_user_id = ?", oldUserID).Update("register_user_id", newUserID).Error
	if err != nil {
		return err
	}
	err = tx.Model(&entity.IncomeAndExpenseBillingUser{}).Where("user_id = ?", oldUserID).Update("user_id", newUserID).Error
	if err != nil {
		return err
	}

	// トランザクションのコミット
	return tx.Commit().Error
}

func (r *incomeAndExpenseRepositoryImpl) DeleteIncomeAndExpense(id uint) error {
	// トランザクションの開始
	tx := r.DB.Begin()

	if err := tx.Unscoped().Where("income_and_expense_id = ?", id).Delete(&entity.IncomeAndExpenseBillingUser{}).Error; err != nil {
		return err
	}
	if err := tx.Unscoped().Where("id = ?", id).Delete(&entity.IncomeAndExpense{}).Error; err != nil {
		return err
	}
	// トランザクションのコミット
	return tx.Commit().Error
}

// 月ごとの合計
func (r *incomeAndExpenseRepositoryImpl) GetMonthlyTotal(monthlyTotals *[]entity.IncomeAndExpenseMonthlyTotal, userIDs []string) error {
	sql := `
	SELECT 
		t1.year_month,
		SUM(t2.monthTotalAmount) AS 'total_amount'
	FROM
		(SELECT 
			DATE_FORMAT(date, '%Y-%m') as 'year_month',
			SUM(iebu.amount) as 'monthTotalAmount'
		FROM income_and_expenses ie
		JOIN income_and_expense_billing_users iebu ON ie.id = iebu.income_and_expense_id
		WHERE user_id IN ?
		GROUP BY DATE_FORMAT(date, '%Y-%m')) t1
	JOIN 
		(SELECT 
			DATE_FORMAT(date, '%Y-%m') as 'year_month',
			SUM(iebu.amount) as 'monthTotalAmount'
		FROM income_and_expenses ie
		JOIN income_and_expense_billing_users iebu ON ie.id = iebu.income_and_expense_id
		WHERE user_id IN ?
		GROUP BY DATE_FORMAT(date, '%Y-%m')) t2
	ON t1.year_month >= t2.year_month
	GROUP BY t1.year_month
	ORDER BY t1.year_month;
	`

	if err := r.DB.Raw(sql, userIDs, userIDs).Scan(&monthlyTotals).Error; err != nil {
		return err
	}

	return nil
}

// 月ごとのカテゴリー別の集計
func (r *incomeAndExpenseRepositoryImpl) GetMonthlyCategory(monthlyCategorys *[]entity.IncomeAndExpenseMonthlyCategory, yearMonth string, userIDs []string, isMinus bool) error {

	queryBuilder := r.DB.Table("income_and_expenses ie").
		Select(`DATE_FORMAT(ie.date, '%Y-%m') as 'year_month', ie.category, ABS(SUM(iebu.amount)) as 'category_amount'`).
		Joins("JOIN income_and_expense_billing_users iebu ON ie.id = iebu.income_and_expense_id").
		Where("DATE_FORMAT(ie.date, '%Y-%m') = ? AND iebu.user_id IN ?", yearMonth, userIDs).
		Group("DATE_FORMAT(ie.date, '%Y-%m'), ie.category").
		Order("category_amount desc, ie.category desc")

	if isMinus {
		queryBuilder = queryBuilder.Where("iebu.amount < ?", 0)
	} else {
		queryBuilder = queryBuilder.Where("iebu.amount >= ?", 0)
	}
	if err := queryBuilder.Find(&monthlyCategorys).Error; err != nil {
		return err
	}

	return nil
}
