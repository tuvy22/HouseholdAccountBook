package entity

import (
	"time"

	"gorm.io/gorm"
)

type IncomeAndExpense struct {
	gorm.Model
	Category       string                        `json:"category" gorm:"column:category"`
	Amount         int                           `json:"amount" gorm:"column:amount"`
	Memo           string                        `json:"memo" gorm:"column:memo"`
	Date           time.Time                     `json:"date" gorm:"column:date;type:date"`
	RegisterUserID string                        `json:"registerUserId" gorm:"column:register_user_id"`
	BillingUsers   []IncomeAndExpenseBillingUser `json:"billingUsers" gorm:"foreignKey:IncomeAndExpenseID"`
}

type IncomeAndExpenseMonthlyTotal struct {
	YearMonth   string `json:"yearMonth" gorm:"column:year_month"`
	TotalAmount int    `json:"totalAmount" gorm:"column:total_amount"`
}

type IncomeAndExpenseMonthlyCategory struct {
	YearMonth      string `json:"yearMonth" gorm:"column:year_month"`
	Category       string `json:"category" gorm:"column:category"`
	CategoryAmount int    `json:"categoryAmount" gorm:"column:category_amount"`
}

// type IncomeAndExpenseWithBillingUser struct {
// 	IncomeAndExpense             `json:"incomeAndExpense"`
// 	IncomeAndExpenseBillingUsers []IncomeAndExpenseBillingUser `json:"incomeAndExpenseBillingUsers" gorm:"foreignKey:IncomeAndExpenseID"`
// }
