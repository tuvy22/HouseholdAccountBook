package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetUser(id string, user *entity.User) error
}

type userRepositoryImpl struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepositoryImpl{DB: db}
}

func (r *userRepositoryImpl) GetUser(id string, user *entity.User) error {
	if err := r.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return err
	}

	return nil
}
