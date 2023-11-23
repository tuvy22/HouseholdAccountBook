package entity

import (
	"gorm.io/gorm"
)

type IncomeAndExpenseBillingUser struct {
	gorm.Model
	IncomeAndExpenseID uint   `gorm:"column:income_and_expense_id;"`
	UserID             string `gorm:"column:user_id;"`
	Amount             int    `gorm:"column:amount"`
	LiquidationFg      bool   `gorm:"column:Liquidation_fg"`
}

type IncomeAndExpenseBillingUserResponse struct {
	IncomeAndExpenseID uint   `json:"incomeAndExpenseID"`
	UserID             string `json:"userID"`
	UserName           string `json:"userName"`
	Amount             int    `json:"amount"`
	LiquidationFg      bool   `json:"liquidationFg"`
}
