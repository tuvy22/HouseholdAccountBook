package entity

import (
	"time"
)

type IncomeAndExpenseBillingUser struct {
	IncomeAndExpenseID uint      `json:"incomeAndExpenseID" gorm:"column:income_and_expense_id;primaryKey;"`
	UserID             string    `json:"userID" gorm:"column:user_id;primaryKey;foreignKey:UserID;references:ID"`
	Amount             int       `json:"amount" gorm:"column:amount"`
	LiquidationFg      bool      `json:"liquidationFg" gorm:"column:Liquidation_fg"`
	CreatedAt          time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt          time.Time `json:"updated_at" gorm:"column:updated_at"`
}
