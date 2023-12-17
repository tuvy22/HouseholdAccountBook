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

type groupRepositoryImpl struct {
	DB *gorm.DB
}

func NewGroupRepository(db *gorm.DB) GroupRepository {
	return &groupRepositoryImpl{DB: db}
}

func (r *groupRepositoryImpl) GetGroup(id uint, Group *entity.Group) error {
	if err := r.DB.Where("id = ?", id).First(&Group).Error; err != nil {
		return err
	}

	return nil
}

func (r *groupRepositoryImpl) CreateGroup(Group *entity.Group) error {

	if err := r.DB.Create(&Group).Error; err != nil {
		return err
	}
	return nil
}
func (r *groupRepositoryImpl) UpdateGroup(Group *entity.Group) error {

	if err := r.DB.Save(&Group).Error; err != nil {
		return err
	}
	return nil
}
func (r *groupRepositoryImpl) DeleteGroup(id uint) error {
	// 論理削除
	if err := r.DB.Unscoped().Where("id = ?", id).Delete(&entity.Group{}).Error; err != nil {
		return err
	}
	return nil
}
