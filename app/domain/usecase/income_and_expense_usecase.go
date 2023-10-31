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
	GetAllIncomeAndExpense() ([]entity.IncomeAndExpense, error)
	CreateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error
	UpdateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error
	DeleteIncomeAndExpense(id uint) error

	GetMonthlyTotal() ([]entity.IncomeAndExpenseMonthlyTotal, error)
	GetMonthlyCategory(yearMonth string, isMinus bool) ([]entity.IncomeAndExpenseMonthlyCategory, error)
}

type incomeAndExpenseUsecaseImpl struct {
	repo repository.IncomeAndExpenseRepository
}

func NewIncomeAndExpenseUsecase(repo repository.IncomeAndExpenseRepository) IncomeAndExpenseUsecase {
	return &incomeAndExpenseUsecaseImpl{repo: repo}
}

func (u *incomeAndExpenseUsecaseImpl) GetAllIncomeAndExpense() ([]entity.IncomeAndExpense, error) {
	incomeAndExpenses := []entity.IncomeAndExpense{}

	err := u.repo.GetAllIncomeAndExpense(&incomeAndExpenses)
	if err != nil {
		return incomeAndExpenses, err
	}

	return incomeAndExpenses, nil
}
func (u *incomeAndExpenseUsecaseImpl) CreateIncomeAndExpense(incomeAndExpense entity.IncomeAndExpense, userId string) error {

	err := u.validateUserID(incomeAndExpense, userId, ErrFailedCreate)
	if err != nil {
		return err
	}

	return u.repo.CreateIncomeAndExpense(&incomeAndExpense)
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

	return u.repo.UpdateIncomeAndExpense(&incomeAndExpense)
}
func (u *incomeAndExpenseUsecaseImpl) DeleteIncomeAndExpense(id uint) error {

	return u.repo.DeleteIncomeAndExpense(id)
}
func (u *incomeAndExpenseUsecaseImpl) GetMonthlyTotal() ([]entity.IncomeAndExpenseMonthlyTotal, error) {
	monthlyTotals := []entity.IncomeAndExpenseMonthlyTotal{}

	err := u.repo.GetMonthlyTotal(&monthlyTotals)
	if err != nil {
		return monthlyTotals, err
	}

	// 期間中のすべての月のリストを作成
	allMonths := u.generateAllMonths(monthlyTotals[0].YearMonth, monthlyTotals[len(monthlyTotals)-1].YearMonth)

	// データをマージ
	result := u.mergeData(monthlyTotals, allMonths)

	return result, nil
}

func (u *incomeAndExpenseUsecaseImpl) GetMonthlyCategory(yearMonth string, isMinus bool) ([]entity.IncomeAndExpenseMonthlyCategory, error) {
	monthlyCategorys := []entity.IncomeAndExpenseMonthlyCategory{}

	err := u.repo.GetMonthlyCategory(&monthlyCategorys, yearMonth, isMinus)
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
