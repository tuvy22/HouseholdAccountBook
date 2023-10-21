package entity

type User struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Password string `gorm:"column:Password"`
	Name     string `json:"name" gorm:"column:name"`
	GroupID  uint   `json:"groupId" gorm:"column:group_id"`
}
