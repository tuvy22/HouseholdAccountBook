package entity

import (
	"math"

	"gorm.io/gorm"
)

const GroupIDNone uint = math.MaxUint64

type Group struct {
	gorm.Model
	Name          string `gorm:"column:name"`
	InitialAmount int    `gorm:"column:initial_amount"`
}

type InitialAmount struct {
	Amount int `json:"amount"`
}

type InviteUrl struct {
	Url string `json:"url"`
}
type InviteToken struct {
	Token string `json:"token"`
}
