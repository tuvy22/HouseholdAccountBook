package entity

import (
	"time"

	"gorm.io/gorm"
)

type Liquidation struct {
	gorm.Model
	Date           time.Time `gorm:"column:date;type:date"`
	RegisterUserID string    `gorm:"column:register_user_id"`
}

type LiquidationCreate struct {
	Date            time.Time `json:"date"`
	RegisterUserID  string    `json:"registerUserID"`
	BillingUsersIds []uint    `json:"billingUsersIds"`
}
