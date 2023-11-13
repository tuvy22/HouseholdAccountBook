package usecase

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/ten313/HouseholdAccountBook/app/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/password"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

type UserUsecase interface {
	Authenticate(creds entity.Credentials) (entity.UserResponse, entity.UserSession, error)
	CheckInviteToken(tokenString string) (uint, error)
	GetAllUser() ([]entity.UserResponse, error)
	GetUser(id string) (entity.UserResponse, error)
	CreateUser(userCreate entity.UserCreate, inviteGroupID uint) (entity.UserResponse, entity.UserSession, error)
	UpdateUser(user entity.User) (entity.UserResponse, entity.UserSession, error)
	DeleteUser(id string) error
	GetUserInviteUrl(groupId uint) (entity.InviteUrl, error)
	ChangeGroup(userId string, inviteGroupID uint) error
}

type userUsecaseImpl struct {
	repo      repository.UserRepository
	groupRepo repository.GroupRepository
	password  password.Password
	config    config.Config
}

func NewUserUsecase(repo repository.UserRepository, groupRepo repository.GroupRepository, password password.Password, config config.Config) UserUsecase {
	return &userUsecaseImpl{repo: repo, groupRepo: groupRepo, password: password, config: config}
}

func (u *userUsecaseImpl) Authenticate(creds entity.Credentials) (entity.UserResponse, entity.UserSession, error) {

	user := entity.User{}

	err := u.repo.GetUser(creds.UserID, &user)
	if err != nil {
		storedUserID := os.Getenv("ID")
		storedPassword := os.Getenv("PASS")

		if creds.UserID == storedUserID && creds.Password == storedPassword {
			hashPassword, err := u.password.HashPassword(creds.Password)
			if err != nil {
				return entity.UserResponse{}, entity.UserSession{}, customerrors.NewCustomError(customerrors.ErrInvalidCredentials)
			}
			user = entity.User{
				ID:       creds.UserID,
				Password: hashPassword,
				Name:     creds.UserID,
			}
		} else {
			return entity.UserResponse{}, entity.UserSession{}, customerrors.NewCustomError(customerrors.ErrInvalidLogin)
		}
	}

	err = u.password.CheckPassword(user.Password, creds.Password)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, customerrors.NewCustomError(customerrors.ErrInvalidLogin)
	}

	return u.convertToUserResponse(user), u.convertToUserSession(user), nil
}

func (u *userUsecaseImpl) createLoginToken(userId string) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userId,
		"exp":     time.Now().Add(time.Minute * 30).Unix(),
	})

	tokenString, err := token.SignedString(u.config.LoginJWTKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func (u *userUsecaseImpl) CheckInviteToken(tokenString string) (uint, error) {

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
		return entity.GroupIDNone, customerrors.NewCustomError(customerrors.ErrInternalServer)
	}
}

func (u *userUsecaseImpl) GetAllUser() ([]entity.UserResponse, error) {
	users := []entity.User{}

	err := u.repo.GetAllUser(&users)
	if err != nil {
		return u.convertToUserResponses(users), err
	}

	return u.convertToUserResponses(users), nil
}
func (u *userUsecaseImpl) GetUser(id string) (entity.UserResponse, error) {
	user := entity.User{}

	err := u.repo.GetUser(id, &user)
	if err != nil {
		return u.convertToUserResponse(user), err
	}

	return u.convertToUserResponse(user), nil
}
func (u *userUsecaseImpl) CreateUser(userCreate entity.UserCreate, inviteGroupID uint) (entity.UserResponse, entity.UserSession, error) {
	hashPassword, err := u.password.HashPassword(userCreate.Password)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}
	var groupId uint
	if inviteGroupID == entity.GroupIDNone {
		//グループ新規作成
		group := entity.Group{}
		u.groupRepo.CreateGroup(&group)
		groupId = group.ID
	} else {
		//招待されたグループに入る
		groupId = inviteGroupID

	}

	createUser := entity.User{
		ID:       userCreate.ID,
		Password: hashPassword,
		Name:     userCreate.Name,
		GroupID:  groupId,
	}
	err = u.repo.CreateUser(&createUser)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}
	user := entity.User{}
	err = u.repo.GetUser(userCreate.ID, &user)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	return u.convertToUserResponse(user), u.convertToUserSession(user), nil
}
func (u *userUsecaseImpl) UpdateUser(user entity.User) (entity.UserResponse, entity.UserSession, error) {
	preUser := entity.User{}
	err := u.repo.GetUser(user.ID, &preUser)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}
	//更新値の設定
	preUser.Name = user.Name
	preUser.GroupID = user.GroupID
	preUser.InitialAmount = user.InitialAmount

	return u.convertToUserResponse(user), u.convertToUserSession(user), u.repo.UpdateUser(&preUser)
}

func (u *userUsecaseImpl) DeleteUser(id string) error {

	return u.repo.DeleteUser(id)
}

func (u *userUsecaseImpl) GetUserInviteUrl(groupId uint) (entity.InviteUrl, error) {
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

func (u *userUsecaseImpl) convertToUserResponse(user entity.User) entity.UserResponse {
	return entity.UserResponse{
		ID:            user.ID,
		Name:          user.Name,
		GroupID:       user.GroupID,
		InitialAmount: user.InitialAmount,
	}
}
func (u *userUsecaseImpl) convertToUserSession(user entity.User) entity.UserSession {
	return entity.UserSession{
		ID:            user.ID,
		Name:          user.Name,
		GroupID:       user.GroupID,
		InitialAmount: user.InitialAmount,
	}
}

func (u *userUsecaseImpl) convertToUserResponses(users []entity.User) []entity.UserResponse {
	userResponses := make([]entity.UserResponse, 0, len(users))

	for _, user := range users {
		userResponse := entity.UserResponse{
			ID:            user.ID,
			Name:          user.Name,
			GroupID:       user.GroupID,
			InitialAmount: user.InitialAmount,
		}
		userResponses = append(userResponses, userResponse)
	}

	return userResponses
}

func (u *userUsecaseImpl) checkToken(tokenString string, key []byte) (jwt.MapClaims, error) {

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

func (u *userUsecaseImpl) ChangeGroup(userId string, inviteGroupID uint) error {

	//更新前のユーザー取得
	preUser := entity.User{}
	err := u.repo.GetUser(userId, &preUser)
	if err != nil {
		return err
	}
	if inviteGroupID == preUser.GroupID {
		//変更後のグループにすでに属している場合はエラー
		return customerrors.NewCustomError(customerrors.ErrGroupUpdateFailed)
	}
	//グループ変更
	preUser.GroupID = inviteGroupID

	//ユーザー情報更新
	err = u.repo.UpdateUser(&preUser)
	if err != nil {
		return err
	}

	//グループ変更後に元いたグループにまだユーザーがいるか確認
	users := []entity.User{}
	err = u.repo.GetAllUser(&users)
	if err != nil {
		return err
	}
	if len(users) == 0 {
		//いなければグループ削除
		err = u.groupRepo.DeleteGroup(inviteGroupID)
		if err != nil {
			return err
		}
	}

	return nil
}
