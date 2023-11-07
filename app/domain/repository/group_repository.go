package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type GroupRepository interface {
	GetGroup(id uint, Group *entity.Group) error
	CreateGroup(Group *entity.Group) error
	UpdateGroup(Group *entity.Group) error
	DeleteGroup(id uint) error
}

type GroupRepositoryImpl struct {
	DB *gorm.DB
}

func NewGroupRepository(db *gorm.DB) GroupRepository {
	return &GroupRepositoryImpl{DB: db}
}

func (r *GroupRepositoryImpl) GetGroup(id uint, Group *entity.Group) error {
	if err := r.DB.Where("id = ?", id).First(&Group).Error; err != nil {
		return err
	}

	return nil
}

func (r *GroupRepositoryImpl) CreateGroup(Group *entity.Group) error {

	if err := r.DB.Create(&Group).Error; err != nil {
		return err
	}
	return nil
}
func (r *GroupRepositoryImpl) UpdateGroup(Group *entity.Group) error {

	if err := r.DB.Save(&Group).Error; err != nil {
		return err
	}
	return nil
}
func (r *GroupRepositoryImpl) DeleteGroup(id uint) error {
	// 論理削除
	if err := r.DB.Where("id = ?", id).Delete(&entity.Group{}).Error; err != nil {
		return err
	}
	return nil
}
