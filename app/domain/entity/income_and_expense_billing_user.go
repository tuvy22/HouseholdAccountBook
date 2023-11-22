package entity

import (
	"gorm.io/gorm"
)

type IncomeAndExpenseBillingUser struct {
	gorm.Model
	IncomeAndExpenseID uint   `json:"incomeAndExpenseID" gorm:"column:income_and_expense_id;"`
	UserID             string `json:"userID" gorm:"column:user_id;"`
	Amount             int    `json:"amount" gorm:"column:amount"`
	LiquidationFg      bool   `json:"liquidationFg" gorm:"column:Liquidation_fg"`
}

type IncomeAndExpenseBillingUserResponse struct {
	UserID        string `json:"userID"`
	UserName      string `json:"userName"`
	Amount        int    `json:"amount"`
	LiquidationFg bool   `json:"liquidationFg"`
}
