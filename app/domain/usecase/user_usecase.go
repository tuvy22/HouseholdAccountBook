package usecase

import (
	"encoding/json"
	"math/rand"
	"os"
	"sort"
	"time"

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
	GetGroupAllUser(groupID uint, firstUserID string) ([]entity.UserResponse, error)
	GetUser(id string) (entity.UserResponse, error)
	CreateUser(userCreate entity.UserCreate, inviteGroupID uint) (entity.UserResponse, entity.UserSession, error)
	UpdateUser(userId string, userUpdate entity.UserUpdate) (entity.UserResponse, entity.UserSession, error)
	ChangePassword(userId string, passwordChange entity.PasswordChange) error
	ChangeGroup(userId string, inviteGroupID uint) (entity.UserResponse, entity.UserSession, error)
	OutGroup(userId string, outGroupID uint) (entity.UserResponse, entity.UserSession, error)
	DeleteUser(userID string) error
}

type userUsecaseImpl struct {
	repo                 repository.UserRepository
	groupRepo            repository.GroupRepository
	categoryRepo         repository.CategoryRepository
	incomeAndExpenseRepo repository.IncomeAndExpenseRepository
	liquidationRepo      repository.LiquidationRepository
	password             password.Password
	config               config.Config
	userValidator        customvalidator.UserValidator
}

func NewUserUsecase(repo repository.UserRepository, groupRepo repository.GroupRepository, categoryRepo repository.CategoryRepository, incomeAndExpenseRepo repository.IncomeAndExpenseRepository, liquidationRepo repository.LiquidationRepository, password password.Password, config config.Config, userValidator customvalidator.UserValidator) UserUsecase {
	return &userUsecaseImpl{repo: repo, groupRepo: groupRepo, categoryRepo: categoryRepo, incomeAndExpenseRepo: incomeAndExpenseRepo, liquidationRepo: liquidationRepo, password: password, config: config, userValidator: userValidator}
}

func (u *userUsecaseImpl) Authenticate(creds entity.Credentials) (entity.UserResponse, entity.UserSession, error) {

	user, err := u.authenticate(creds, customerrors.ErrInvalidLogin)
	if err != nil {
		return u.convertToUserResponse(user), u.convertToUserSession(user), customerrors.NewCustomError(customerrors.ErrInvalidLogin)
	}

	return u.convertToUserResponse(user), u.convertToUserSession(user), nil
}

func (u *userUsecaseImpl) authenticate(creds entity.Credentials, checkPasswordErrCode customerrors.ErrorCode) (entity.User, error) {

	user := entity.User{}

	err := u.repo.GetUser(creds.UserID, &user)
	if err != nil {
		return entity.User{}, customerrors.NewCustomError(customerrors.ErrInvalidLogin)
	}

	err = u.password.CheckPassword(user.Password, creds.Password)
	if err != nil {
		return entity.User{}, customerrors.NewCustomError(checkPasswordErrCode)
	}

	return user, nil
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

	err = u.checkRegisterUserID(userCreate.ID)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	var groupId uint
	if inviteGroupID == entity.GroupIDNone {

		//グループ新規作成
		groupId, err = u.createGroup()
		if err != nil {
			return entity.UserResponse{}, entity.UserSession{}, err
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
func (u *userUsecaseImpl) createGroup() (uint, error) {
	//グループ新規作成
	group := entity.Group{}
	u.groupRepo.CreateGroup(&group)
	groupId := group.ID

	//カテゴリーデータの初期投入
	initIncomeCategorys, err := u.getInitCategory(groupId, false)
	if err != nil {
		return 0, err
	}
	initExpenseCategorys, err := u.getInitCategory(groupId, true)
	if err != nil {
		return 0, err
	}

	for _, category := range append(initIncomeCategorys, initExpenseCategorys...) {
		err := u.categoryRepo.CreateCategory(&category)
		if err != nil {
			return 0, err
		}
	}
	return groupId, nil
}

func (u *userUsecaseImpl) UpdateUser(userId string, userUpdate entity.UserUpdate) (entity.UserResponse, entity.UserSession, error) {
	err := u.userValidator.UserUpdateValidate(userUpdate)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	user := entity.User{}
	err = u.repo.GetUser(userId, &user)
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
func (u *userUsecaseImpl) ChangePassword(userID string, passwordChange entity.PasswordChange) error {

	err := u.userValidator.PasswordChangeValidate(passwordChange)
	if err != nil {
		return err
	}

	credentials := entity.Credentials{
		UserID:   userID,
		Password: passwordChange.PrePassword,
	}
	user, err := u.authenticate(credentials, customerrors.ErrPrePasswordCredentials)
	if err != nil {
		return err
	}

	//パスワードハッシュ化
	hashPassword, err := u.password.HashPassword(passwordChange.Password)
	if err != nil {
		return err
	}

	//更新値の設定
	user.Password = hashPassword

	err = u.repo.UpdateUser(&user)
	if err != nil {
		return err
	}

	return nil
}

func (u *userUsecaseImpl) generateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func (u *userUsecaseImpl) getGroupUserIDs(groupID uint) ([]string, error) {
	users := []entity.User{}
	err := u.repo.GetAllUserByGroupId(groupID, &users)
	if err != nil {
		return []string{}, err
	}

	userIDs := make([]string, 0, len(users))
	for _, user := range users {
		userIDs = append(userIDs, user.ID)
	}
	return userIDs, nil
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

func (u *userUsecaseImpl) checkRegisterUserID(userID string) error {
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
func (u *userUsecaseImpl) checkUserID(loginUserId, userId string) error {
	if loginUserId != userId {
		return customerrors.NewCustomError(customerrors.ErrBadRequest)
	}
	return nil
}
func (u *userUsecaseImpl) checkUnLiquidation(userID string, groupUserIDs []string) error {

	//自分以外のユーザー一覧を作成
	var groupOtherUserIDs []string
	for _, item := range groupUserIDs {
		if item != userID {
			groupOtherUserIDs = append(groupOtherUserIDs, item)
		}
	}

	myRegisterResult := []entity.IncomeAndExpense{}
	targetRegisterResult := []entity.IncomeAndExpense{}
	var zeroTime time.Time

	err := u.incomeAndExpenseRepo.GetIncomeAndExpenseLiquidations(&myRegisterResult, zeroTime, zeroTime, []string{userID}, groupOtherUserIDs)
	if err != nil {
		return err
	}

	err = u.incomeAndExpenseRepo.GetIncomeAndExpenseLiquidations(&targetRegisterResult, zeroTime, zeroTime, groupOtherUserIDs, []string{userID})
	if err != nil {
		return err

	}
	unLiquidations := append(myRegisterResult, targetRegisterResult...)

	if len(unLiquidations) > 0 {
		return customerrors.NewCustomError(customerrors.ErrUnLiquidationNoUserDelete)
	}

	return nil

}

func (u *userUsecaseImpl) ChangeGroup(userId string, inviteGroupID uint) (entity.UserResponse, entity.UserSession, error) {

	//更新前のユーザー取得
	preUser := entity.User{}
	err := u.repo.GetUser(userId, &preUser)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//同じグループに入ろうとしてないかチェック
	err = u.checkAlreadyInGroup(preUser.GroupID, inviteGroupID)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//所属してるグループのユーザーID取得
	groupUserIDs, err := u.getGroupUserIDs(preUser.GroupID)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//二人以上のグループからの移動はエラー
	err = u.checkGroupInMultiUser(groupUserIDs)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//変更前のID保持
	preGroupID := preUser.GroupID
	//グループ変更
	preUser.GroupID = inviteGroupID

	//ユーザー情報更新
	err = u.repo.UpdateUser(&preUser)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//元いたグループにまだユーザーがいなければグループ削除
	err = u.conditionalDeleteGroupAndCategory(preGroupID)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//変更後のデータ取得
	user := entity.User{}
	err = u.repo.GetUser(userId, &user)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	return u.convertToUserResponse(user), u.convertToUserSession(user), nil

}
func (u *userUsecaseImpl) conditionalDeleteGroupAndCategory(groupID uint) error {

	//グループにユーザーがいないか確認
	users := []entity.User{}
	err := u.repo.GetAllUserByGroupId(groupID, &users)
	if err != nil {
		return err
	}
	if len(users) == 0 {
		//いなければ削除
		err := u.groupRepo.DeleteGroup(groupID)
		if err != nil {
			return err
		}
		err = u.categoryRepo.DeleteAllCategory(true, groupID)
		if err != nil {
			return err
		}
		err = u.categoryRepo.DeleteAllCategory(false, groupID)
		if err != nil {
			return err
		}
	}
	return nil
}

func (u *userUsecaseImpl) checkAlreadyInGroup(preGroupID uint, inviteGroupID uint) error {
	if preGroupID == inviteGroupID {
		//変更後のグループにすでに属している場合はエラー
		return customerrors.NewCustomError(customerrors.ErrAlreadyInGroup)
	}
	return nil
}

func (u *userUsecaseImpl) OutGroup(userID string, outGroupID uint) (entity.UserResponse, entity.UserSession, error) {

	//所属してるグループのユーザーID取得
	groupUserIDs, err := u.getGroupUserIDs(outGroupID)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//一人のグループでないか確認
	err = u.checkGroupInSingleUser(groupUserIDs)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//未清算がないか確認
	err = u.checkUnLiquidation(userID, groupUserIDs)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//更新前のユーザー取得
	preUser := entity.User{}
	err = u.repo.GetUser(userID, &preUser)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//グループ新規作成
	groupId, err := u.createGroup()
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//新規グループに移動
	preUser.GroupID = groupId

	//ユーザー情報更新
	err = u.repo.UpdateUser(&preUser)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	//変更後のデータ取得
	user := entity.User{}
	err = u.repo.GetUser(userID, &user)
	if err != nil {
		return entity.UserResponse{}, entity.UserSession{}, err
	}

	return u.convertToUserResponse(user), u.convertToUserSession(user), nil
}

func (u *userUsecaseImpl) DeleteUser(userID string) error {

	//削除前のユーザー取得
	preUser := entity.User{}
	err := u.repo.GetUser(userID, &preUser)
	if err != nil {
		return err
	}

	//所属してるグループのユーザーID取得
	groupUserIDs, err := u.getGroupUserIDs(preUser.GroupID)
	if err != nil {
		return err
	}

	//未清算がないか確認
	err = u.checkUnLiquidation(userID, groupUserIDs)
	if err != nil {
		return err
	}

	//ユーザー削除(物理)
	err = u.repo.DeleteUser(userID)
	if err != nil {
		return err
	}

	//グループ・カテゴリー削除(自分一人のグループなら)
	err = u.conditionalDeleteGroupAndCategory(preUser.GroupID)
	if err != nil {
		return err
	}

	//同じIDを使われないようにダミーユーザーを作成
	dummyUser := entity.User{}
	dummyUser.ID = userID
	hashPassword, err := u.password.HashPassword(u.generateRandomString(32))
	if err != nil {
		return err
	}
	dummyUser.Password = hashPassword
	dummyUser.Name = ""
	dummyUser.GroupID = entity.GroupIDNone

	err = u.repo.CreateUser(&dummyUser)
	if err != nil {
		return err
	}

	//ID置き換え
	// err = u.incomeAndExpenseRepo.UpdateIncomeAndExpenseUserID(preUser.ID, dummyUser.ID)
	// if err != nil {
	// 	return err
	// }
	// err = u.liquidationRepo.UpdateLiquidationUserID(preUser.ID, dummyUser.ID)
	// if err != nil {
	// 	return err
	// }

	return nil
}

func (u *userUsecaseImpl) checkGroupInSingleUser(groupUserIDs []string) error {
	if len(groupUserIDs) < 2 {
		//一人のグループはエラー
		return customerrors.NewCustomError(customerrors.ErrSingleUserOutGroup)
	}
	return nil
}

func (u *userUsecaseImpl) checkGroupInMultiUser(groupUserIDs []string) error {
	if len(groupUserIDs) > 1 {
		//一人より多いグループはエラー
		return customerrors.NewCustomError(customerrors.ErrMultiUserLiquidation)
	}
	return nil
}

func (u *userUsecaseImpl) moveToFirst(users []entity.User, targetID string) []entity.User {
	// sort.SliceStableを使用してIDが"5"の要素を先頭に移動
	sort.SliceStable(users, func(i, j int) bool {
		// i番目の要素が対象IDならtrueを返して先頭に移動
		return users[i].ID == targetID
	})

	return users
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
