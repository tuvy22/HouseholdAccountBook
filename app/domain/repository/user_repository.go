package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetAllUser(users *[]entity.User) error
	GetAllUserByGroupId(groupId uint, users []*entity.User) error
	GetUser(id string, user *entity.User) error
	CreateUser(user *entity.User) error
	UpdateUser(user *entity.User) error
	DeleteUser(id string) error
}

type userRepositoryImpl struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepositoryImpl{DB: db}
}

func (r *userRepositoryImpl) GetAllUser(users *[]entity.User) error {

	if err := r.DB.Order("id").Find(&users).Error; err != nil {
		return err
	}
	return nil
}
func (r *userRepositoryImpl) GetAllUserByGroupId(groupId uint, users []*entity.User) error {

	if err := r.DB.Where("group_id = ?", groupId).Order("id").Find(&users).Error; err != nil {
		return err
	}
	return nil

}

func (r *userRepositoryImpl) GetUser(id string, user *entity.User) error {
	if err := r.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return err
	}

	return nil
}

func (r *userRepositoryImpl) CreateUser(user *entity.User) error {

	if err := r.DB.Create(&user).Error; err != nil {
		return err
	}
	return nil
}
func (r *userRepositoryImpl) UpdateUser(user *entity.User) error {

	if err := r.DB.Save(&user).Error; err != nil {
		return err
	}
	return nil
}
func (r *userRepositoryImpl) DeleteUser(id string) error {

	if err := r.DB.Where("id = ?", id).Delete(&entity.User{}).Error; err != nil {
		return err
	}
	return nil
}
