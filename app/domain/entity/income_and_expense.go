package entity

import "time"

type IncomeAndExpense struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Category       string    `json:"category" gorm:"column:category"`
	Amount         int       `json:"amount" gorm:"column:amount"`
	Memo           string    `json:"memo" gorm:"column:memo"`
	Date           time.Time `json:"date" gorm:"column:date;type:date"`
	RegisterUserID string    `json:"registerUserId" gorm:"column:register_user_id"`
	GroupID        uint      `json:"groupId" gorm:"column:group_id"`
}

type IncomeAndExpenseMonthlyTotal struct {
	YearMonth   string `json:"yearMonth" gorm:"column:year_month"`
	TotalAmount int    `json:"totalAmount" gorm:"column:total_amount"`
	GroupID     uint   `json:"groupId" gorm:"column:group_id"`
}

type IncomeAndExpenseMonthlyCategory struct {
	YearMonth      string `json:"yearMonth" gorm:"column:year_month"`
	Category       string `json:"category" gorm:"column:category"`
	CategoryAmount int    `json:"categoryAmount" gorm:"column:category_amount"`
	GroupID        uint   `json:"groupId" gorm:"column:group_id"`
}
