package entity

import (
	"time"

	"gorm.io/gorm"
)

type Liquidation struct {
	gorm.Model
	Date           time.Time `gorm:"column:date;type:date"`
	RegisterUserID string    `gorm:"column:register_user_id"`
	TargetUserID   string    `gorm:"column:target_user_id"`
}

type LiquidationCreate struct {
	Date            time.Time `json:"date" validate:"required"`
	RegisterUserID  string    `json:"registerUserID"`
	TargetUserID    string    `json:"targetUserID"`
	BillingUsersIds []uint    `json:"billingUsersIds"`
}
type LiquidationResponse struct {
	ID               uint                                  `json:"id" `
	Date             time.Time                             `json:"date"`
	RegisterUserID   string                                `json:"registerUserID"`
	RegisterUserName string                                `json:"registerUserName"`
	TargetUserID     string                                `json:"targetUserID"`
	TargetUserName   string                                `json:"targetUserName"`
	BillingUsers     []IncomeAndExpenseBillingUserResponse `json:"billingUsers"`
}
