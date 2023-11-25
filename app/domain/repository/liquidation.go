package repository

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/gorm"
)

type LiquidationRepository interface {
	CreateLiquidationAndUpdateBillingUser(liquidation *entity.Liquidation, updateBillingUserID []uint) error
}

type liquidationRepositoryImpl struct {
	DB *gorm.DB
}

func NewLiquidationRepository(db *gorm.DB) LiquidationRepository {
	return &liquidationRepositoryImpl{DB: db}
}

func (r *liquidationRepositoryImpl) CreateLiquidationAndUpdateBillingUser(liquidation *entity.Liquidation, updateBillingUserID []uint) error {
	// トランザクションを開始
	tx := r.DB.Begin()

	if err := tx.Create(&liquidation).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Model(&entity.IncomeAndExpenseBillingUser{}).Where("id IN ?", updateBillingUserID).Update("liquidation_id", liquidation.ID).Error; err != nil {
		tx.Rollback() // エラーが発生した場合、ロールバック
		return err
	}

	// トランザクションをコミット
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}
