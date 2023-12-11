package usecase

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/customvalidator"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

type GroupUsecase interface {
	CheckInviteToken(tokenString string) (uint, error)
	GetUserInviteUrl(groupId uint) (entity.InviteUrl, error)
	GetInitialAmount(groupId uint) (entity.InitialAmount, error)
	UpdateInitialAmount(groupId uint, initialAmount entity.InitialAmount) (entity.InitialAmount, error)
}

type groupUsecaseImpl struct {
	repo           repository.GroupRepository
	config         config.Config
	groupValidator customvalidator.GroupValidator
}

func NewGroupUsecase(repo repository.GroupRepository, config config.Config, groupValidator customvalidator.GroupValidator) GroupUsecase {
	return &groupUsecaseImpl{repo: repo, config: config, groupValidator: groupValidator}
}

func (u *groupUsecaseImpl) CheckInviteToken(tokenString string) (uint, error) {

	claims, err := u.checkToken(tokenString, u.config.InviteJWTKey)
	if err != nil {
		return entity.GroupIDNone, err
	}
	groupIdInterface, ok := claims["group_id"]
	if !ok {
		return entity.GroupIDNone, customerrors.NewCustomError(customerrors.ErrInternalServer)
	}

	if floatValue, ok := groupIdInterface.(float64); ok {
		groupId := uint(floatValue)
		return groupId, nil
	} else {
		return entity.GroupIDNone, customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
}

func (u *groupUsecaseImpl) GetUserInviteUrl(groupId uint) (entity.InviteUrl, error) {
	// JWTトークンの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"group_id": groupId,
		"exp":      time.Now().Add(time.Minute * 30).Unix(),
	})

	tokenString, err := token.SignedString(u.config.InviteJWTKey)
	if err != nil {
		return entity.InviteUrl{}, err
	}
	// 生成したトークンをURLに組み込む
	inviteURLString := fmt.Sprintf("https://%s/user-invite?token=%s", os.Getenv("DOMAIN"), tokenString)

	inviteUrl := entity.InviteUrl{
		Url: inviteURLString,
	}

	return inviteUrl, nil
}
func (u *groupUsecaseImpl) GetInitialAmount(groupId uint) (entity.InitialAmount, error) {
	group := entity.Group{}
	err := u.repo.GetGroup(groupId, &group)
	if err != nil {
		return u.convertToInitialAmount(0), err
	}

	return u.convertToInitialAmount(group.InitialAmount), nil
}
func (u *groupUsecaseImpl) UpdateInitialAmount(groupId uint, initialAmount entity.InitialAmount) (entity.InitialAmount, error) {

	err := u.groupValidator.InitialAmountValidate(initialAmount)
	if err != nil {
		return u.convertToInitialAmount(0), err
	}

	group := entity.Group{}
	err = u.repo.GetGroup(groupId, &group)
	if err != nil {
		return u.convertToInitialAmount(0), err
	}
	group.InitialAmount = initialAmount.Amount

	err = u.repo.UpdateGroup(&group)
	if err != nil {
		return u.convertToInitialAmount(0), err
	}

	return u.convertToInitialAmount(group.InitialAmount), nil
}

func (u *groupUsecaseImpl) checkToken(tokenString string, key []byte) (jwt.MapClaims, error) {

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, customerrors.NewCustomError(customerrors.ErrInvalidCredentials)
		}
		return key, nil
	})

	if err != nil {
		return nil, customerrors.NewCustomError(customerrors.ErrInvalidCredentials)
	}
	claims, ok := token.Claims.(jwt.MapClaims)

	if ok && token.Valid {
		return claims, nil
	} else {
		return nil, customerrors.NewCustomError(customerrors.ErrInvalidCredentials)
	}
}

func (u *groupUsecaseImpl) convertToInitialAmount(amount int) entity.InitialAmount {
	return entity.InitialAmount{
		Amount: amount,
	}
}
