package entity

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name      string `gorm:"column:name"`
	GroupID   uint   `gorm:"column:group_id"`
	IsExpense bool   `gorm:"column:is_Expense"`
}
type CategoryResponse struct {
	ID        uint   `json:"id" `
	Name      string `json:"name" `
	GroupID   uint   `json:"groupID" `
	IsExpense bool   `json:"isExpense" `
}
