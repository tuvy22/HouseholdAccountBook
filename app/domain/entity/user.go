package entity

import "time"

type User struct {
	ID            string    `gorm:"primaryKey"`
	Password      string    `gorm:"column:Password"`
	Name          string    `gorm:"column:name"`
	GroupID       uint      `gorm:"column:group_id"`
	InitialAmount int       `gorm:"column:initial_amount"`
	CreatedAt     time.Time `gorm:"created_at"`
	UpdatedAt     time.Time `gorm:"update_at"`
}
type UserCreate struct {
	ID       string `json:"id"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type UserResponse struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	GroupID       uint   `json:"groupId"`
	InitialAmount int    `json:"initialAmount"`
}
type UserSession struct {
	ID            string
	Name          string
	GroupID       uint
	InitialAmount int
}

type Credentials struct {
	UserID   string `json:"userId"`
	Password string `json:"password"`
}

type InviteUrl struct {
	Url string `json:"url"`
}
type InviteToken struct {
	Token string `json:"token"`
}
