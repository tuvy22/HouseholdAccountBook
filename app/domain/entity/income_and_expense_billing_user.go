package entity

import (
	"gorm.io/gorm"
)

const NoneLiquidation uint = 0

type IncomeAndExpenseBillingUser struct {
	gorm.Model
	IncomeAndExpenseID uint   `gorm:"column:income_and_expense_id"`
	UserID             string `gorm:"column:user_id"`
	Amount             int    `gorm:"column:amount"`
	LiquidationID      uint   `gorm:"column:liquidation_id"`
}

type IncomeAndExpenseBillingUserResponse struct {
	ID                 uint   `json:"id" `
	IncomeAndExpenseID uint   `json:"incomeAndExpenseID"`
	UserID             string `json:"userID"`
	UserName           string `json:"userName"`
	Amount             int    `json:"amount"`
	LiquidationID      uint   `json:"liquidationID"`
}
