package entity

import "time"

type User struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Password  string    `json:"password" gorm:"column:Password"`
	Name      string    `json:"name" gorm:"column:name"`
	GroupID   uint      `json:"groupId" gorm:"column:group_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
type UserResponse struct {
	ID      string `json:"id" gorm:"primaryKey"`
	Name    string `json:"name" gorm:"column:name"`
	GroupID uint   `json:"groupId" gorm:"column:group_id"`
}

type Credentials struct {
	UserID   string `json:"userId"`
	Password string `json:"password"`
}
