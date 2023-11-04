package entity

type User struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Password string `json:"password" gorm:"column:Password"`
	Name     string `json:"name" gorm:"column:name"`
	GroupID  uint   `json:"groupId" gorm:"column:group_id"`
}

type Credentials struct {
	UserID   string `json:"userId"`
	Password string `json:"password"`
}
