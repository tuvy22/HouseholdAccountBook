package entity

import "time"

type IncomeAndExpense struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Category       string    `json:"category" gorm:"column:category"`
	Amount         int       `json:"amount" gorm:"column:amount"`
	Memo           string    `json:"memo" gorm:"column:memo"`
	Date           time.Time `json:"date" gorm:"column:date;type:date"`
	RegisterUserID string    `json:"registerUserId" gorm:"column:register_user_id"`
	IsInitial      bool      `json:"isInitial" gorm:"column:is_initial"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
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
