package entity

import "gorm.io/gorm"

type Liquidation struct {
	gorm.Model
	BillingUsers []IncomeAndExpenseBillingUser `json:"billingUsers"`
}
