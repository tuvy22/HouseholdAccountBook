package usecase

import (
	"fmt"
	"time"

	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
)

const (
	ErrFailedCreate = "failed create"
	ErrFailedUpdate = "failed update"
)

type IncomeAndExpenseUsecase interface {
	GetAllIncomeAndExpenseWithBillingUser(groupID uint) ([]entity.IncomeAndExpense, error)
	CreateIncomeAndExpenseWithBillingUser(data entity.IncomeAndExpense, userId string) error
	UpdateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error
	DeleteIncomeAndExpense(id uint) error

	GetMonthlyTotal(groupID uint, InitialAmount int) ([]entity.IncomeAndExpenseMonthlyTotal, error)
	GetMonthlyCategory(yearMonth string, groupID uint, isMinus bool) ([]entity.IncomeAndExpenseMonthlyCategory, error)
}

type incomeAndExpenseUsecaseImpl struct {
	repo     repository.IncomeAndExpenseRepository
	userRepo repository.UserRepository
}

func NewIncomeAndExpenseUsecase(repo repository.IncomeAndExpenseRepository, userRepo repository.UserRepository) IncomeAndExpenseUsecase {
	return &incomeAndExpenseUsecaseImpl{repo: repo, userRepo: userRepo}
}

func (u *incomeAndExpenseUsecaseImpl) GetAllIncomeAndExpenseWithBillingUser(groupID uint) ([]entity.IncomeAndExpense, error) {
	result := []entity.IncomeAndExpense{}

	userIDs, err := u.getGroupUserIDs(groupID)
	if err != nil {
		return result, err
	}

	err = u.repo.GetAllIncomeAndExpenseWithBillingUser(&result, userIDs)
	if err != nil {
		return result, err
	}

	return result, nil
}

func (u *incomeAndExpenseUsecaseImpl) CreateIncomeAndExpenseWithBillingUser(data entity.IncomeAndExpense, userId string) error {

	err := u.validateUserID(data, userId, ErrFailedCreate)
	if err != nil {
		return err
	}
	err = u.validateBillingUser(data, ErrFailedCreate)
	if err != nil {
		return err
	}

	return u.repo.CreateIncomeAndExpense(&data)
}
func (u *incomeAndExpenseUsecaseImpl) UpdateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error {
	preIncomeAndExpense := entity.IncomeAndExpense{}
	err := u.repo.GetIncomeAndExpense(incomeAndExpense.ID, &preIncomeAndExpense)
	if err != nil {
		return err
	}

	err = u.validateUserID(preIncomeAndExpense, userId, ErrFailedUpdate)
	if err != nil {
		return err
	}
	//更新値の設定
	preIncomeAndExpense.Amount = incomeAndExpense.Amount
	preIncomeAndExpense.Category = incomeAndExpense.Category
	preIncomeAndExpense.Date = incomeAndExpense.Date
	preIncomeAndExpense.Memo = incomeAndExpense.Memo

	return u.repo.UpdateIncomeAndExpense(&preIncomeAndExpense)
}
func (u *incomeAndExpenseUsecaseImpl) DeleteIncomeAndExpense(id uint) error {

	return u.repo.DeleteIncomeAndExpense(id)
}
func (u *incomeAndExpenseUsecaseImpl) GetMonthlyTotal(groupID uint, InitialAmount int) ([]entity.IncomeAndExpenseMonthlyTotal, error) {
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
	result := u.mergeData(monthlyTotals, allMonths)

	//ユーザーの初期残高と合算
	result[0].TotalAmount = result[0].TotalAmount + InitialAmount

	return result, nil
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

func (u *incomeAndExpenseUsecaseImpl) validateUserID(incomeAndExpense entity.IncomeAndExpense, userId string, errMessage string) error {
	if incomeAndExpense.RegisterUserID != userId {
		return fmt.Errorf(errMessage)
	}
	return nil
}
func (u *incomeAndExpenseUsecaseImpl) validateBillingUser(data entity.IncomeAndExpense, errMessage string) error {
	if len(data.BillingUsers) == 0 {
		return fmt.Errorf(errMessage)
	}

	total := 0
	for _, billingUser := range data.BillingUsers {
		total += billingUser.Amount
		if data.RegisterUserID != billingUser.UserID {
		}
	}
	//ユーザーへの請求が合計金額と一致するか確認
	if total != data.Amount {
		return fmt.Errorf(errMessage)
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
