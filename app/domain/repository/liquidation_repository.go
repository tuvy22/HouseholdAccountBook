package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type LiquidationRepository interface {
	CreateLiquidationAndUpdateBillingUser(liquidation *entity.Liquidation, updateBillingUserIDs []uint) error
	DeleteLiquidationAndUpdateBillingUser(id uint, updateBillingUserIDs []uint) error
	GetLiquidation(id uint, liquidation *entity.Liquidation) error
	GetAllLiquidation(liquidations *[]entity.Liquidation, registerUserIDs []string) error
	GetAllLiquidationBillingUserByID(incomeAndExpenseBillingUser *[]entity.IncomeAndExpenseBillingUser, billingUserID uint) error
	UpdateLiquidationUserID(oldUserID string, newUserID string) error
}

type liquidationRepositoryImpl struct {
	DB *gorm.DB
}

func NewLiquidationRepository(db *gorm.DB) LiquidationRepository {
	return &liquidationRepositoryImpl{DB: db}
}

func (r *liquidationRepositoryImpl) CreateLiquidationAndUpdateBillingUser(liquidation *entity.Liquidation, updateBillingUserIDs []uint) error {
	// トランザクションを開始
	tx := r.DB.Begin()

	if err := tx.Create(&liquidation).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Model(&entity.IncomeAndExpenseBillingUser{}).Where("id IN ?", updateBillingUserIDs).Update("liquidation_id", liquidation.ID).Error; err != nil {
		tx.Rollback() // エラーが発生した場合、ロールバック
		return err
	}

	// トランザクションをコミット
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (r *liquidationRepositoryImpl) DeleteLiquidationAndUpdateBillingUser(id uint, updateBillingUserIDs []uint) error {
	// トランザクションを開始
	tx := r.DB.Begin()

	if err := tx.Where("id = ?", id).Delete(&entity.Liquidation{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Model(&entity.IncomeAndExpenseBillingUser{}).Where("id IN ?", updateBillingUserIDs).Update("liquidation_id", entity.NoneLiquidationID).Error; err != nil {
		tx.Rollback() // エラーが発生した場合、ロールバック
		return err
	}

	// トランザクションをコミット
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (r *liquidationRepositoryImpl) GetLiquidation(id uint, liquidation *entity.Liquidation) error {

	if err := r.DB.Where("id = ?", id).First(&liquidation).Error; err != nil {
		return err
	}
	return nil
}

func (r *liquidationRepositoryImpl) GetAllLiquidation(liquidations *[]entity.Liquidation, registerUserIDs []string) error {
	if err := r.DB.Where("register_user_id IN ?", registerUserIDs).Order("Date desc, id desc").Find(&liquidations).Error; err != nil {
		return err
	}
	return nil
}

func (r *liquidationRepositoryImpl) GetAllLiquidationBillingUserByID(incomeAndExpenseBillingUser *[]entity.IncomeAndExpenseBillingUser, liquidationID uint) error {
	if err := r.DB.Where("liquidation_id = ?", liquidationID).Order("id desc").Find(&incomeAndExpenseBillingUser).Error; err != nil {
		return err
	}
	return nil
}

func (r *liquidationRepositoryImpl) UpdateLiquidationUserID(oldUserID string, newUserID string) error {

	err := r.DB.Model(&entity.Liquidation{}).Where("register_user_id = ?", oldUserID).Update("register_user_id", newUserID).Error
	if err != nil {
		return err
	}
	err = r.DB.Model(&entity.Liquidation{}).Where("target_user_id = ?", oldUserID).Update("target_user_id", newUserID).Error
	if err != nil {
		return err
	}
	return nil
}
