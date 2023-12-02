package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	GetAllCategory(categorys *[]entity.Category, groupID uint, isExpense bool) error
	GetCategory(id uint, Category *entity.Category) error
	CreateCategory(Category *entity.Category) error
	DeleteAllCategory(isExpense bool, groupID uint) error
}

type categoryRepositoryImpl struct {
	DB *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepositoryImpl{DB: db}
}

func (r *categoryRepositoryImpl) GetAllCategory(categorys *[]entity.Category, groupID uint, isExpense bool) error {
	if err := r.DB.Where("group_id = ?", groupID).Where("is_Expense = ?", isExpense).Order("id desc").Find(&categorys).Error; err != nil {
		return err
	}
	return nil
}

func (r *categoryRepositoryImpl) GetCategory(id uint, Category *entity.Category) error {
	if err := r.DB.Where("id = ?", id).First(&Category).Error; err != nil {
		return err
	}
	return nil
}

func (r *categoryRepositoryImpl) CreateCategory(Category *entity.Category) error {

	if err := r.DB.Create(&Category).Error; err != nil {
		return err
	}
	return nil
}

func (r *categoryRepositoryImpl) DeleteAllCategory(isExpense bool, groupID uint) error {

	if err := r.DB.Where("is_expense = ?", isExpense).Where("group_id = ?", groupID).Delete(&entity.Category{}).Error; err != nil {
		return err
	}
	return nil
}
