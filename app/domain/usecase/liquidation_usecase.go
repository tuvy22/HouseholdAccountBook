package usecase

import (
	"fmt"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

type LiquidationUsecase interface {
	CreateLiquidation(data entity.LiquidationCreate, userId string, groupId uint) error
	GetAllLiquidation(groupID uint) ([]entity.LiquidationResponse, error)
	DeleteLiquidation(liquidationID uint, userId string) error
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
		TargetUserID:   data.TargetUserID,
	}

	return u.repo.CreateLiquidationAndUpdateBillingUser(&createData, data.BillingUsersIds)
}
func (u *liquidationUsecaseImpl) DeleteLiquidation(liquidationID uint, userId string) error {

	liquidation := entity.Liquidation{}

	err := u.repo.GetLiquidation(liquidationID, &liquidation)
	if err != nil {
		return fmt.Errorf(ErrFailedDelete)
	}

	err = u.validateLiquidationID(liquidation, userId, ErrFailedDelete)
	if err != nil {
		return err
	}

	//清算に関連する支払い情報を取得
	var updateBillingUserIDs []uint
	billingUsers := []entity.IncomeAndExpenseBillingUser{}
	err = u.repo.GetAllLiquidationBillingUserByID(&billingUsers, liquidation.ID)
	if err != nil {
		return err
	}
	for _, bu := range billingUsers {
		updateBillingUserIDs = append(updateBillingUserIDs, bu.ID)
	}

	return u.repo.DeleteLiquidationAndUpdateBillingUser(liquidationID, updateBillingUserIDs)
}

func (u *liquidationUsecaseImpl) GetAllLiquidation(groupID uint) ([]entity.LiquidationResponse, error) {
	liquidations := []entity.Liquidation{}

	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return []entity.LiquidationResponse{}, err
	}

	err = u.repo.GetAllLiquidation(&liquidations, userIDs)
	if err != nil {
		return []entity.LiquidationResponse{}, err
	}
	userMap, err := u.getUserMap(groupID)
	if err != nil {
		return []entity.LiquidationResponse{}, err
	}

	results := u.convertToLiquidations(liquidations, userMap)

	for i := range results {
		result := &results[i]

		resultBillingUser := []entity.IncomeAndExpenseBillingUser{}
		err = u.repo.GetAllLiquidationBillingUserByID(&resultBillingUser, result.ID)
		if err != nil {
			return []entity.LiquidationResponse{}, err
		}
		result.BillingUsers = u.convertToBillingUsersResponse(resultBillingUser, userMap)
	}

	return results, nil
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

func (u *liquidationUsecaseImpl) validateLiquidationID(liquidation entity.Liquidation, userId string, errMessage string) error {

	//自分自身で登録したデータであるかを確認
	if liquidation.RegisterUserID != userId {
		return fmt.Errorf(errMessage)
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

func (u *liquidationUsecaseImpl) getUserMap(groupID uint) (map[string]string, error) {
	var users []entity.User

	//ユーザー情報取得(ユーザー名設定のため)
	err := u.userRepo.GetAllUserByGroupId(groupID, &users)
	if err != nil {
		return map[string]string{}, err
	}

	userMap := make(map[string]string)
	for _, user := range users {
		userMap[user.ID] = user.Name
	}
	return userMap, nil
}

func (u *liquidationUsecaseImpl) convertToLiquidations(liquidations []entity.Liquidation, userMap map[string]string) []entity.LiquidationResponse {

	resultResponses := make([]entity.LiquidationResponse, 0, len(liquidations))

	for _, liquidation := range liquidations {

		response := entity.LiquidationResponse{
			ID:               liquidation.ID,
			Date:             liquidation.Date,
			RegisterUserID:   liquidation.RegisterUserID,
			RegisterUserName: userMap[liquidation.RegisterUserID],
			TargetUserID:     liquidation.TargetUserID,
			TargetUserName:   userMap[liquidation.TargetUserID],
		}
		resultResponses = append(resultResponses, response)
	}

	return resultResponses

}

func (u *liquidationUsecaseImpl) convertToBillingUsersResponse(billingUsers []entity.IncomeAndExpenseBillingUser, userMap map[string]string) []entity.IncomeAndExpenseBillingUserResponse {

	resultResponses := make([]entity.IncomeAndExpenseBillingUserResponse, 0, len(billingUsers))

	for _, billingUser := range billingUsers {
		response := entity.IncomeAndExpenseBillingUserResponse{
			ID:                 billingUser.ID,
			IncomeAndExpenseID: billingUser.IncomeAndExpenseID,
			UserID:             billingUser.UserID,
			UserName:           userMap[billingUser.UserID],
			Amount:             billingUser.Amount,
			LiquidationID:      billingUser.LiquidationID,
		}
		resultResponses = append(resultResponses, response)

	}

	return resultResponses

}
