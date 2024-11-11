package entity

import (
	"time"

	"gorm.io/gorm"
)

type IncomeAndExpense struct {
	gorm.Model
	Category       string    `gorm:"column:category"`
	Memo           string    `gorm:"column:memo"`
	Date           time.Time `gorm:"column:date;type:date"`
	RegisterUserID string    `gorm:"column:register_user_id"`
	BillingUsers   []IncomeAndExpenseBillingUser
}
type IncomeAndExpenseCreate struct {
	Category       string `json:"category" validate:"required"`
	Amount         int    `json:"amount" validate:"gte=-99999999,lte=99999999"`
	Memo           string `json:"memo" validate:"max=50"`
	Date           string `json:"date" validate:"required"`
	RegisterUserID string `json:"registerUserID"`
	BillingUsers   []IncomeAndExpenseBillingUser
}

type IncomeAndExpenseUpdate struct {
	Category     string `json:"category" validate:"required"`
	Amount       int    `json:"amount" validate:"gte=-99999999,lte=99999999"`
	Memo         string `json:"memo" validate:"max=50"`
	Date         string `json:"date" validate:"required"`
	BillingUsers []IncomeAndExpenseBillingUser
}

type IncomeAndExpenseResponse struct {
	ID               uint                                  `json:"id"`
	Category         string                                `json:"category"`
	Amount           int                                   `json:"amount"`
	Memo             string                                `json:"memo"`
	Date             string                                `json:"date"`
	RegisterUserID   string                                `json:"registerUserID"`
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
