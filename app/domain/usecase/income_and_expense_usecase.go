package usecase

import (
	"sort"
	"time"

	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

const pageSize = 3

type IncomeAndExpenseUsecase interface {
	GetAllIncomeAndExpense(groupID uint, page int) ([]entity.IncomeAndExpenseResponse, error)
	GetAllIncomeAndExpenseMaxPage(groupID uint) (int, error)
	GetIncomeAndExpenseLiquidations(fromDate time.Time, toDate time.Time, loginUserID string, billingUserID string, groupID uint) ([]entity.IncomeAndExpenseResponse, error)

	CreateIncomeAndExpenseWithBillingUser(data entity.IncomeAndExpense, userId string, groupID uint) error
	UpdateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string, groupID uint) error
	DeleteIncomeAndExpense(id uint, userId string) error

	GetMonthlyTotal(groupID uint) ([]entity.IncomeAndExpenseMonthlyTotal, error)
	GetMonthlyCategory(yearMonth string, groupID uint, isMinus bool) ([]entity.IncomeAndExpenseMonthlyCategory, error)
}

type incomeAndExpenseUsecaseImpl struct {
	repo      repository.IncomeAndExpenseRepository
	userRepo  repository.UserRepository
	groupRepo repository.GroupRepository
}

func NewIncomeAndExpenseUsecase(repo repository.IncomeAndExpenseRepository, userRepo repository.UserRepository, groupRepo repository.GroupRepository) IncomeAndExpenseUsecase {
	return &incomeAndExpenseUsecaseImpl{repo: repo, userRepo: userRepo, groupRepo: groupRepo}
}

func (u *incomeAndExpenseUsecaseImpl) GetAllIncomeAndExpense(groupID uint, page int) ([]entity.IncomeAndExpenseResponse, error) {
	result := []entity.IncomeAndExpense{}

	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return u.convertToIncomeAndExpenseResponse(result, groupID), err
	}

	if page < 1 {
		page = 1
	}

	offset := (page - 1) * pageSize

	err = u.repo.GetAllIncomeAndExpense(&result, userIDs, offset, pageSize)
	if err != nil {
		return u.convertToIncomeAndExpenseResponse(result, groupID), err
	}

	return u.convertToIncomeAndExpenseResponse(result, groupID), nil
}
func (u *incomeAndExpenseUsecaseImpl) GetAllIncomeAndExpenseMaxPage(groupID uint) (int, error) {
	var count int64

	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return 1, err
	}

	err = u.repo.GetAllIncomeAndExpenseCount(&count, userIDs)
	if err != nil {
		return 1, err
	}
	if count <= 1 {
		return 1, nil
	}

	return (int(count-1) / pageSize) + 1, nil
}

func (u *incomeAndExpenseUsecaseImpl) GetIncomeAndExpenseLiquidations(fromDate time.Time, toDate time.Time, loginUserID string, billingUserID string, groupID uint) ([]entity.IncomeAndExpenseResponse, error) {
	myResult := []entity.IncomeAndExpense{}
	targetResult := []entity.IncomeAndExpense{}

	err := u.repo.GetIncomeAndExpenseLiquidations(&myResult, fromDate, toDate, loginUserID, billingUserID)
	if err != nil {
		return u.convertToIncomeAndExpenseResponse(myResult, groupID), err
	}

	err = u.repo.GetIncomeAndExpenseLiquidations(&targetResult, fromDate, toDate, billingUserID, loginUserID)
	if err != nil {
		return u.convertToIncomeAndExpenseResponse(targetResult, groupID), err

	}
	result := append(myResult, targetResult...)

	// 結果をソートする
	sort.Slice(result, func(i, j int) bool {
		return u.sortByDateDescIDDesc(&(result)[i], &(result)[j])
	})

	return u.convertToIncomeAndExpenseResponse(result, groupID), nil
}

// ソート用の比較関数
func (u *incomeAndExpenseUsecaseImpl) sortByDateDescIDDesc(a, b *entity.IncomeAndExpense) bool {
	if a.Date.Equal(b.Date) {
		return a.ID > b.ID // 同じ日付の場合はIDで降順
	}
	return a.Date.After(b.Date) // 日付で降順
}

func (u *incomeAndExpenseUsecaseImpl) CreateIncomeAndExpenseWithBillingUser(data entity.IncomeAndExpense, userId string, groupID uint) error {

	err := u.validateUserID(data, userId)
	if err != nil {
		return err
	}
	u.validateBillingUserID(data, groupID)
	if err != nil {
		return err
	}
	err = u.validateBillingUserPlus(data)
	if err != nil {
		return err
	}

	err = u.validateBillingUserTotal(data)
	if err != nil {
		return err
	}
	data.BillingUsers = u.covertBillingUserPlusDelete(data.BillingUsers)

	return u.repo.CreateIncomeAndExpense(&data)
}
func (u *incomeAndExpenseUsecaseImpl) UpdateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string, groupID uint) error {
	preIncomeAndExpense := entity.IncomeAndExpense{}
	err := u.repo.GetIncomeAndExpense(incomeAndExpense.ID, &preIncomeAndExpense)
	if err != nil {
		return err
	}

	err = u.validateUserID(preIncomeAndExpense, userId)
	if err != nil {
		return err
	}
	u.validateBillingUserID(incomeAndExpense, groupID)
	if err != nil {
		return err
	}

	err = u.validateBillingUserPlus(incomeAndExpense)
	if err != nil {
		return err
	}

	err = u.validateBillingUserTotal(incomeAndExpense)
	if err != nil {
		return err
	}
	incomeAndExpense.BillingUsers = u.covertBillingUserPlusDelete(incomeAndExpense.BillingUsers)

	//更新値の設定
	preIncomeAndExpense.Amount = incomeAndExpense.Amount
	preIncomeAndExpense.Category = incomeAndExpense.Category
	preIncomeAndExpense.Date = incomeAndExpense.Date
	preIncomeAndExpense.Memo = incomeAndExpense.Memo

	preBuMap := make(map[uint]entity.IncomeAndExpenseBillingUser)
	for _, preBu := range preIncomeAndExpense.BillingUsers {
		preBuMap[preBu.ID] = preBu
	}

	updateBu := []entity.IncomeAndExpenseBillingUser{}
	for _, bu := range incomeAndExpense.BillingUsers {

		if preBu, exists := preBuMap[bu.ID]; exists {

			//清算済みは金額変更を許容しない
			err = u.validateLiquidationAmount(bu.Amount, preBu)
			if err != nil {
				return err
			}

			//すでに存在するデータの更新
			preBu.Amount = bu.Amount
			updateBu = append(updateBu, preBu)

		} else {
			//存在しないデータの更新
			updateBu = append(updateBu, bu)
		}
	}
	preIncomeAndExpense.BillingUsers = updateBu

	return u.repo.UpdateIncomeAndExpense(&preIncomeAndExpense)
}
func (u *incomeAndExpenseUsecaseImpl) DeleteIncomeAndExpense(id uint, userId string) error {
	preIncomeAndExpense := entity.IncomeAndExpense{}
	err := u.repo.GetIncomeAndExpense(id, &preIncomeAndExpense)
	if err != nil {
		return err
	}

	err = u.validateUserID(preIncomeAndExpense, userId)
	if err != nil {
		return err
	}
	err = u.validateBillingUserDelete(preIncomeAndExpense)
	if err != nil {
		return err
	}

	return u.repo.DeleteIncomeAndExpense(id)
}
func (u *incomeAndExpenseUsecaseImpl) GetMonthlyTotal(groupID uint) ([]entity.IncomeAndExpenseMonthlyTotal, error) {
	monthlyTotals := []entity.IncomeAndExpenseMonthlyTotal{}
	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return monthlyTotals, err
	}

	err = u.repo.GetMonthlyTotal(&monthlyTotals, userIDs)
	if err != nil {
		return monthlyTotals, err
	}

	if len(monthlyTotals) == 0 {
		return monthlyTotals, nil
	}

	// 期間中のすべての月のリストを作成
	allMonths := u.generateAllMonths(monthlyTotals[0].YearMonth, monthlyTotals[len(monthlyTotals)-1].YearMonth)
	// データをマージ
	results := u.mergeData(monthlyTotals, allMonths)

	//初期残高と合算
	group := entity.Group{}
	err = u.groupRepo.GetGroup(groupID, &group)
	if err != nil {
		return monthlyTotals, err
	}
	for i, _ := range results {
		results[i].TotalAmount = results[i].TotalAmount + group.InitialAmount
	}

	return results, nil
}

func (u *incomeAndExpenseUsecaseImpl) GetMonthlyCategory(yearMonth string, groupID uint, isMinus bool) ([]entity.IncomeAndExpenseMonthlyCategory, error) {
	monthlyCategorys := []entity.IncomeAndExpenseMonthlyCategory{}

	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return monthlyCategorys, err
	}

	err = u.repo.GetMonthlyCategory(&monthlyCategorys, yearMonth, userIDs, isMinus)
	if err != nil {
		return monthlyCategorys, err
	}

	return monthlyCategorys, nil
}
func (u *incomeAndExpenseUsecaseImpl) covertBillingUserPlusDelete(data []entity.IncomeAndExpenseBillingUser) []entity.IncomeAndExpenseBillingUser {
	result := []entity.IncomeAndExpenseBillingUser{}
	for _, billingUser := range data {
		if billingUser.Amount < 0 {
			result = append(result, billingUser)
		}
	}

	return result
}

func (u *incomeAndExpenseUsecaseImpl) validateUserID(incomeAndExpense entity.IncomeAndExpense, userId string) error {
	if incomeAndExpense.RegisterUserID != userId {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	return nil
}

func (u *incomeAndExpenseUsecaseImpl) validateBillingUserPlus(data entity.IncomeAndExpense) error {

	for _, billingUser := range data.BillingUsers {
		if billingUser.Amount > 0 {
			return customerrors.NewCustomError(customerrors.ErrBadRequest)
		}
	}

	return nil
}

func (u *incomeAndExpenseUsecaseImpl) validateBillingUserTotal(data entity.IncomeAndExpense) error {
	if data.Amount >= 0 {
		//収入はチェック対象外
		return nil
	}

	if len(data.BillingUsers) == 0 {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}

	total := 0
	for _, billingUser := range data.BillingUsers {
		total += billingUser.Amount
	}
	//ユーザーへの請求が合計金額と一致するか確認
	if total != data.Amount {
		return customerrors.NewCustomError(customerrors.ErrBillUserExpenseUnMatch)
	}

	return nil
}
func (u *incomeAndExpenseUsecaseImpl) validateBillingUserID(data entity.IncomeAndExpense, groupID uint) error {
	groupUserIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return err
	}
	for _, billingUser := range data.BillingUsers {
		hit := false
		for _, groupUserID := range groupUserIDs {
			if billingUser.UserID == groupUserID {
				hit = true
				continue
			}
		}
		if !hit {
			//自身のグループ外のデータがある場合
			return customerrors.NewCustomError(customerrors.ErrBadRequest)
		}
	}

	return nil
}

func (u *incomeAndExpenseUsecaseImpl) validateBillingUserDelete(data entity.IncomeAndExpense) error {

	countLiquidation := 0
	countLiquidationComplete := 0
	for _, billingUser := range data.BillingUsers {
		if billingUser.UserID >= data.RegisterUserID {
			//清算対象外
			continue
		}
		countLiquidation += 1
		if billingUser.LiquidationID > entity.NoneLiquidationID {
			countLiquidationComplete += 1
		}
	}
	if countLiquidationComplete == 0 || countLiquidation == countLiquidationComplete {
		//全て未清算または、全て清算済みのみが削除できる
		return nil
	}
	return customerrors.NewCustomError(customerrors.ErrBadRequest)
}

func (u *incomeAndExpenseUsecaseImpl) validateLiquidationAmount(amount int, preBu entity.IncomeAndExpenseBillingUser) error {
	if preBu.LiquidationID != entity.NoneLiquidationID && amount != preBu.Amount {
		//精算済みの金額変更はエラー
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	return nil
}

// すべての月のリストを生成
func (u *incomeAndExpenseUsecaseImpl) generateAllMonths(start, end string) []string {
	startTime, _ := time.Parse("2006-01", start)
	endTime, _ := time.Parse("2006-01", end)

	var months []string
	for startTime.Before(endTime) || startTime.Equal(endTime) {
		months = append(months, startTime.Format("2006-01"))
		startTime = startTime.AddDate(0, 1, 0)
	}

	return months
}

// データをマージ
func (u *incomeAndExpenseUsecaseImpl) mergeData(data []entity.IncomeAndExpenseMonthlyTotal, months []string) []entity.IncomeAndExpenseMonthlyTotal {
	dataMap := make(map[string]entity.IncomeAndExpenseMonthlyTotal)
	for _, d := range data {
		dataMap[d.YearMonth] = d
	}

	var merged []entity.IncomeAndExpenseMonthlyTotal
	var lastValue int // 1つ前の月のTotalAmountを保存するための変数

	for _, month := range months {
		if val, ok := dataMap[month]; ok {
			merged = append(merged, val)
			lastValue = val.TotalAmount // 実際のデータが存在する場合、lastValueを更新
		} else {
			merged = append(merged, entity.IncomeAndExpenseMonthlyTotal{YearMonth: month, TotalAmount: lastValue}) // 存在しない場合、lastValueを使用
		}
	}

	return merged
}

func (u *incomeAndExpenseUsecaseImpl) filterByYearMonth(incomes []entity.IncomeAndExpenseMonthlyTotal, start, end string) []entity.IncomeAndExpenseMonthlyTotal {
	var result []entity.IncomeAndExpenseMonthlyTotal
	for _, income := range incomes {
		if income.YearMonth >= start && income.YearMonth <= end {
			result = append(result, income)
		}
	}
	return result
}
func (u *incomeAndExpenseUsecaseImpl) getGroupUserIDs(groupID uint) ([]string, error) {
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
func (u *incomeAndExpenseUsecaseImpl) convertToIncomeAndExpenseResponse(incomeAndExpenses []entity.IncomeAndExpense, groupID uint) []entity.IncomeAndExpenseResponse {

	var users []entity.User

	//ユーザー情報取得(ユーザー名設定のため)
	u.userRepo.GetAllUserByGroupId(groupID, &users)
	userMap := make(map[string]string)
	for _, user := range users {
		userMap[user.ID] = user.Name
	}

	resultResponses := make([]entity.IncomeAndExpenseResponse, 0, len(incomeAndExpenses))

	for _, incomeAndExpense := range incomeAndExpenses {
		billingUsers := []entity.IncomeAndExpenseBillingUserResponse{}

		for _, billingUser := range incomeAndExpense.BillingUsers {
			response := entity.IncomeAndExpenseBillingUserResponse{
				ID:                 billingUser.ID,
				IncomeAndExpenseID: billingUser.IncomeAndExpenseID,
				UserID:             billingUser.UserID,
				UserName:           userMap[billingUser.UserID],
				Amount:             billingUser.Amount,
				LiquidationID:      billingUser.LiquidationID,
			}
			billingUsers = append(billingUsers, response)

		}

		response := entity.IncomeAndExpenseResponse{
			ID:               incomeAndExpense.ID,
			Category:         incomeAndExpense.Category,
			Amount:           incomeAndExpense.Amount,
			Memo:             incomeAndExpense.Memo,
			Date:             incomeAndExpense.Date,
			RegisterUserID:   incomeAndExpense.RegisterUserID,
			RegisterUserName: userMap[incomeAndExpense.RegisterUserID],
			BillingUsers:     billingUsers,
		}
		resultResponses = append(resultResponses, response)
	}

	return resultResponses

}
