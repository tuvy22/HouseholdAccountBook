package entity

import (
	"math"

	"gorm.io/gorm"
)

const GroupIDNone uint = math.MaxUint64

type Group struct {
	gorm.Model
	Name string `json:"name"`
}
