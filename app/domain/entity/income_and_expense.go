package entity

type IncomeAndExpense struct {
	ID             uint   `json:"id" gorm:"primaryKey"`
	Category       string `json:"category" gorm:"column:category"`
	Amount         int    `json:"amount" gorm:"column:amount"`
	Memo           string `json:"memo" gorm:"column:memo"`
	Date           string `json:"date" gorm:"column:date"`
	SortAt         string `json:"sortAt" gorm:"column:sort_at"`
	RegisterUserID string `json:"registerUserId" gorm:"column:register_user_id"`
}
