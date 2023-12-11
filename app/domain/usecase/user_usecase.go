package usecase

import (
	"encoding/json"
	"os"

	"github.com/golang-jwt/jwt"
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/customvalidator"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/password"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

type UserUsecase interface {
	Authenticate(creds entity.Credentials) (entity.UserResponse, entity.UserSession, error)
	GetAllUser() ([]entity.UserResponse, error)
	GetGroupAllUser(groupID uint, firstUserID string) ([]entity.UserResponse, error)
	GetUser(id string) (entity.UserResponse, error)
	CreateUser(userCreate entity.UserCreate, inviteGroupID uint) (entity.UserResponse, entity.UserSession, error)
	UpdateUser(user entity.UserUpdate) (entity.UserResponse, entity.UserSession, error)
	DeleteUser(id string) error
	ChangeGroup(userId string, inviteGroupID uint) error
}

type userUsecaseImpl struct {
	repo          repository.UserRepository
	groupRepo     repository.GroupRepository
	categoryRepo  repository.CategoryRepository
	password      password.Password
	config        config.Config
	userValidator customvalidator.UserValidator
}

func NewUserUsecase(repo repository.UserRepository, groupRepo repository.GroupRepository, categoryRepo repository.CategoryRepository, password password.Password, config config.Config, userValidator customvalidator.UserValidator) UserUsecase {
	return &userUsecaseImpl{repo: repo, groupRepo: groupRepo, categoryRepo: categoryRepo, password: password, config: config, userValidator: userValidator}
}

func (u *userUsecaseImpl) Authenticate(creds entity.Credentials) (entity.UserResponse, entity.UserSession, error) {

	user := entity.User{}

	err := u.repo.GetUser(creds.UserID, &user)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, customerrors.NewCustomError(customerrors.ErrInvalidLogin)
	}

	err = u.password.CheckPassword(user.Password, creds.Password)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, customerrors.NewCustomError(customerrors.ErrInvalidLogin)
	}

	return u.convertToUserResponse(user), u.convertToUserSession(user), nil
}

func (u *userUsecaseImpl) GetAllUser() ([]entity.UserResponse, error) {
	users := []entity.User{}

	err := u.repo.GetAllUser(&users)
	if err != nil {
		return u.convertToUserResponses(users), err
	}

	return u.convertToUserResponses(users), nil
}
func (u *userUsecaseImpl) GetGroupAllUser(groupID uint, firstUserID string) ([]entity.UserResponse, error) {
	users := []entity.User{}
	err := u.repo.GetAllUserByGroupId(groupID, &users)
	if err != nil {
		return u.convertToUserResponses(users), err
	}
	return u.convertToUserResponses(u.moveToFirst(users, firstUserID)), nil
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
	err := u.userValidator.UserCreateValidate(userCreate)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	err = u.checkRegisteredUserID(userCreate.ID)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	var groupId uint
	if inviteGroupID == entity.GroupIDNone {

		//グループ新規作成
		group := entity.Group{}
		u.groupRepo.CreateGroup(&group)
		groupId = group.ID

		//カテゴリーデータの初期投入
		initIncomeCategorys, err := u.getInitCategory(groupId, false)
		if err != nil {
			return entity.UserResponse{}, entity.UserSession{}, err
		}
		initExpenseCategorys, err := u.getInitCategory(groupId, true)
		if err != nil {
			return entity.UserResponse{}, entity.UserSession{}, err
		}

		for _, category := range append(initIncomeCategorys, initExpenseCategorys...) {
			err := u.categoryRepo.CreateCategory(&category)
			if err != nil {
				return entity.UserResponse{}, entity.UserSession{}, err
			}
		}

	} else {
		//招待されたグループに入る
		groupId = inviteGroupID

	}
	hashPassword, err := u.password.HashPassword(userCreate.Password)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
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
func (u *userUsecaseImpl) UpdateUser(userUpdate entity.UserUpdate) (entity.UserResponse, entity.UserSession, error) {
	err := u.userValidator.UserUpdateValidate(userUpdate)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	user := entity.User{}
	err = u.repo.GetUser(userUpdate.ID, &user)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}
	//更新値の設定
	user.Name = userUpdate.Name

	err = u.repo.UpdateUser(&user)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	return u.convertToUserResponse(user), u.convertToUserSession(user), nil
}

func (u *userUsecaseImpl) DeleteUser(id string) error {

	return u.repo.DeleteUser(id)
}

func (u *userUsecaseImpl) convertToUserResponse(user entity.User) entity.UserResponse {
	return entity.UserResponse{
		ID:      user.ID,
		Name:    user.Name,
		GroupID: user.GroupID,
	}
}
func (u *userUsecaseImpl) convertToUserSession(user entity.User) entity.UserSession {
	return entity.UserSession{
		ID:      user.ID,
		Name:    user.Name,
		GroupID: user.GroupID,
	}
}

func (u *userUsecaseImpl) convertToUserResponses(users []entity.User) []entity.UserResponse {
	userResponses := make([]entity.UserResponse, 0, len(users))

	for _, user := range users {
		userResponse := entity.UserResponse{
			ID:      user.ID,
			Name:    user.Name,
			GroupID: user.GroupID,
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

func (u *userUsecaseImpl) checkRegisteredUserID(userID string) error {
	var count int64
	err := u.repo.CountUserByID(userID, &count)
	if err != nil {
		return err
	}
	if count >= 1 {
		return customerrors.NewCustomError(customerrors.ErrRegisteredUserID)
	}
	return nil

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
		return customerrors.NewCustomError(customerrors.ErrAlreadyInGroup)
	}
	//変更前のID保持
	preGroupID := preUser.GroupID
	//グループ変更
	preUser.GroupID = inviteGroupID

	//ユーザー情報更新
	err = u.repo.UpdateUser(&preUser)
	if err != nil {
		return err
	}

	//グループ変更後に元いたグループにまだユーザーがいるか確認
	users := []entity.User{}
	err = u.repo.GetAllUserByGroupId(preGroupID, &users)
	if err != nil {
		return err
	}
	if len(users) == 0 {
		//いなければグループ削除
		err = u.groupRepo.DeleteGroup(preGroupID)
		if err != nil {
			return err
		}
	}

	return nil
}
func (u *userUsecaseImpl) moveToFirst(users []entity.User, targetID string) []entity.User {
	targetIndex := -1
	for i, user := range users {
		if user.ID == targetID {
			targetIndex = i
			break
		}
	}

	// IDが見つからない場合、またはすでに先頭にいる場合は、元の配列を返す
	if targetIndex <= 0 {
		return users
	}

	// 特定のIDを持つ要素を先頭に移動
	// targetIndexが配列の途中にある場合のみ、処理を行う
	return append([]entity.User{users[targetIndex]}, append(users[:targetIndex], users[targetIndex+1:]...)...)
}

func (u *userUsecaseImpl) getInitCategory(groupID uint, isExpense bool) ([]entity.Category, error) {

	var categories []entity.Category

	dir, err := os.Getwd()
	if err != nil {
		return categories, err

	}
	var fileName string
	if isExpense {
		fileName = "iniExpenseCategory.json"
	} else {
		fileName = "iniIncomeCategory.json"

	}

	// JSONファイルの読み込み
	data, err := os.ReadFile(dir + "/infrastructure/data/" + fileName)
	if err != nil {
		return categories, err
	}

	// JSONをCategoryスライスにデシリアライズ
	if err := json.Unmarshal(data, &categories); err != nil {
		return categories, err
	}

	//設定
	for i := range categories {
		categories[i].GroupID = groupID
		categories[i].IsExpense = isExpense
	}

	return categories, nil
}
