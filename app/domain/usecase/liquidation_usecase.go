package usecase

import (
	"fmt"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

type LiquidationUsecase interface {
	CreateLiquidation(data entity.LiquidationCreate, userId string, groupId uint) error
}

type liquidationUsecaseImpl struct {
	repo     repository.LiquidationRepository
	ieRepo   repository.IncomeAndExpenseRepository
	userRepo repository.UserRepository
}

func NewLiquidationUsecase(repo repository.LiquidationRepository, ieRepo repository.IncomeAndExpenseRepository, userRepo repository.UserRepository) LiquidationUsecase {
	return &liquidationUsecaseImpl{repo: repo, ieRepo: ieRepo, userRepo: userRepo}
}

func (u *liquidationUsecaseImpl) CreateLiquidation(data entity.LiquidationCreate, userId string, groupId uint) error {

	err := u.validateUserID(data, userId, ErrFailedCreate)
	if err != nil {
		return err
	}
	err = u.validateBillingUserID(data.BillingUsersIds, groupId, ErrFailedCreate)
	if err != nil {
		return err
	}

	createData := entity.Liquidation{
		Date:           data.Date,
		RegisterUserID: data.RegisterUserID,
		// //以下は更新のみ
		// BillingUsers: []entity.IncomeAndExpenseBillingUser{},
	}

	return u.repo.CreateLiquidationAndUpdateBillingUser(&createData, data.BillingUsersIds)
}
func (u *liquidationUsecaseImpl) validateUserID(data entity.LiquidationCreate, userId string, errMessage string) error {
	if data.RegisterUserID != userId {
		return fmt.Errorf(errMessage)
	}
	return nil
}

func (u *liquidationUsecaseImpl) validateBillingUserID(liquidationBillingUserIds []uint, groupID uint, errMessage string) error {
	// グループに属するユーザーIDを取得
	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return fmt.Errorf(errMessage)
	}

	// 収入と支出のデータを取得
	ieDatas := []entity.IncomeAndExpense{}
	err = u.ieRepo.GetAllIncomeAndExpense(&ieDatas, userIDs)
	if err != nil {
		return fmt.Errorf(errMessage)
	}

	// BillingUsersのIDをマップとして格納
	billingUserIDs := make(map[uint]bool)
	for _, ieData := range ieDatas {
		for _, buData := range ieData.BillingUsers {
			billingUserIDs[buData.ID] = true
		}
	}

	// liquidationBillingUserIds の各IDがbillingUserIDsに存在するか確認
	for _, checkId := range liquidationBillingUserIds {
		if !billingUserIDs[checkId] {
			return fmt.Errorf(errMessage)
		}
	}
	return nil
}

func (u *liquidationUsecaseImpl) getGroupUserIDs(groupID uint) ([]string, error) {
	users := []entity.User{}
	err := u.userRepo.GetAllUserByGroupId(groupID, &users)
	if err != nil {
		return []string{}, err
	}

	userIDs := make([]string, 0, len(users))
	for _, user := range users {
		userIDs = append(userIDs, user.ID)
	}
	return userIDs, nil
}
