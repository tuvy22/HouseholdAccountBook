package entity

import "gorm.io/gorm"

type Group struct {
	gorm.Model
	Name string `json:"name"`
}
