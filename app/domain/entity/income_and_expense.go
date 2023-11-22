package entity

import (
	"time"

	"gorm.io/gorm"
)

type IncomeAndExpense struct {
	gorm.Model
	Category       string    `gorm:"column:category"`
	Amount         int       `gorm:"column:amount"`
	Memo           string    `gorm:"column:memo"`
	Date           time.Time `gorm:"column:date;type:date"`
	RegisterUserID string    `gorm:"column:register_user_id"`
	BillingUsers   []IncomeAndExpenseBillingUser
}
type IncomeAndExpenseResponse struct {
	ID               uint                                  `json:"id" `
	Category         string                                `json:"category" `
	Amount           int                                   `json:"amount" `
	Memo             string                                `json:"memo" `
	Date             time.Time                             `json:"date" `
	RegisterUserID   string                                `json:"registerUserId"`
	RegisterUserName string                                `json:"registerUserName"`
	BillingUsers     []IncomeAndExpenseBillingUserResponse `json:"billingUsers"`
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
