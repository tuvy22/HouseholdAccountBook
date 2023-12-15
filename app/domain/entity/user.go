package entity

import (
	"time"
)

type User struct {
	ID        string    `gorm:"primaryKey"`
	Password  string    `gorm:"column:Password"`
	Name      string    `gorm:"column:name"`
	GroupID   uint      `gorm:"column:group_id"`
	CreatedAt time.Time `gorm:"created_at"`
	UpdatedAt time.Time `gorm:"update_at"`
}
type UserCreate struct {
	ID       string `json:"id" validate:"required,min=5,max=10,alphanum"`
	Password string `json:"password" validate:"required,min=8,max=50,password"`
	Name     string `json:"name" validate:"required,max=10"`
}

type UserUpdate struct {
	Name string `json:"name" validate:"required,max=10"`
}
type PasswordChange struct {
	PrePassword string `json:"prePassword"`
	Password    string `json:"password" validate:"required,min=8,max=50,password"`
}

type UserResponse struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	GroupID uint   `json:"groupId"`
}
type UserSession struct {
	ID      string
	Name    string
	GroupID uint
}

type Credentials struct {
	UserID   string `json:"userId"`
	Password string `json:"password"`
}
