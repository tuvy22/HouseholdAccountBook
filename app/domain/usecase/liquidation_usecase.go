package usecase

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/customvalidator"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

type LiquidationUsecase interface {
	CreateLiquidation(data entity.LiquidationCreate, userId string, groupId uint) error
	GetAllLiquidation(userID string, groupID uint) ([]entity.LiquidationResponse, error)
	DeleteLiquidation(liquidationID uint, userId string) error
}

type liquidationUsecaseImpl struct {
	repo                 repository.LiquidationRepository
	ieRepo               repository.IncomeAndExpenseRepository
	userRepo             repository.UserRepository
	liquidationValidator customvalidator.LiquidationValidator
}

func NewLiquidationUsecase(repo repository.LiquidationRepository, ieRepo repository.IncomeAndExpenseRepository, userRepo repository.UserRepository, liquidationValidator customvalidator.LiquidationValidator) LiquidationUsecase {
	return &liquidationUsecaseImpl{repo: repo, ieRepo: ieRepo, userRepo: userRepo, liquidationValidator: liquidationValidator}
}

func (u *liquidationUsecaseImpl) CreateLiquidation(data entity.LiquidationCreate, userId string, groupId uint) error {

	err := u.liquidationValidator.LiquidationCreateValidate(data)
	if err != nil {
		return err
	}

	err = u.checkRegisterUserID(data, userId)
	if err != nil {
		return err
	}
	err = u.checkBillingUserID(data.BillingUsersIds, groupId)
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
		return err
	}

	err = u.checkLiquidationID(liquidation, userId)
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

func (u *liquidationUsecaseImpl) GetAllLiquidation(userID string, groupID uint) ([]entity.LiquidationResponse, error) {
	liquidations := []entity.Liquidation{}

	err := u.repo.GetAllLiquidation(&liquidations, []string{userID})
	if err != nil {
		return []entity.LiquidationResponse{}, err
	}
	userMap, err := u.getUserMap(groupID)
	if err != nil {
		return []entity.LiquidationResponse{}, err
	}

	results := u.convertToLiquidations(liquidations, userMap)

	//IDに紐づくBillingUserの設定
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

func (u *liquidationUsecaseImpl) checkRegisterUserID(data entity.LiquidationCreate, userId string) error {
	if data.RegisterUserID != userId {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	return nil
}

func (u *liquidationUsecaseImpl) checkBillingUserID(liquidationBillingUserIds []uint, groupID uint) error {
	// グループに属するユーザーIDを取得
	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return err
	}

	// 収入と支出のデータを取得
	ieDatas := []entity.IncomeAndExpense{}
	err = u.ieRepo.GetAllIncomeAndExpense(&ieDatas, userIDs, 0, 0)
	if err != nil {
		return err
	}

	// BillingUsersのIDをマップとして格納
	billingUserIDs := make(map[uint]bool)
	for _, ieData := range ieDatas {
		for _, buData := range ieData.BillingUsers {
			//未成線のみ許容
			if buData.LiquidationID == 0 {
				billingUserIDs[buData.ID] = true
			}
		}
	}

	// liquidationBillingUserIds の各IDがbillingUserIDsに存在するか確認
	for _, checkId := range liquidationBillingUserIds {
		if !billingUserIDs[checkId] {
			return customerrors.NewCustomError(customerrors.ErrBadRequest)
		}
	}
	return nil
}

func (u *liquidationUsecaseImpl) checkLiquidationID(liquidation entity.Liquidation, userId string) error {

	//自分自身で登録したデータであるかを確認
	if liquidation.RegisterUserID != userId {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
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

		registerUserName, ok := userMap[liquidation.RegisterUserID]
		// 別のグループに移動したなど今は存在しないユーザーの場合の設定
		if !ok {
			registerUserName = "不明なユーザー"
		}

		targetUserName, ok := userMap[liquidation.TargetUserID]
		// 別のグループに移動したなど今は存在しないユーザーの場合の設定
		if !ok {
			targetUserName = "不明なユーザー"
		}

		response := entity.LiquidationResponse{
			ID:               liquidation.ID,
			Date:             liquidation.Date,
			RegisterUserID:   liquidation.RegisterUserID,
			RegisterUserName: registerUserName,
			TargetUserID:     liquidation.TargetUserID,
			TargetUserName:   targetUserName,
		}
		resultResponses = append(resultResponses, response)
	}

	return resultResponses

}

func (u *liquidationUsecaseImpl) convertToBillingUsersResponse(billingUsers []entity.IncomeAndExpenseBillingUser, userMap map[string]string) []entity.IncomeAndExpenseBillingUserResponse {

	resultResponses := make([]entity.IncomeAndExpenseBillingUserResponse, 0, len(billingUsers))

	for _, billingUser := range billingUsers {

		userName, ok := userMap[billingUser.UserID]
		// 別のグループに移動したなど今は存在しないユーザーの場合の設定
		if !ok {
			userName = "不明なユーザー"
		}

		response := entity.IncomeAndExpenseBillingUserResponse{
			ID:                 billingUser.ID,
			IncomeAndExpenseID: billingUser.IncomeAndExpenseID,
			UserID:             billingUser.UserID,
			UserName:           userName,
			Amount:             billingUser.Amount,
			LiquidationID:      billingUser.LiquidationID,
		}
		resultResponses = append(resultResponses, response)

	}

	return resultResponses

}
