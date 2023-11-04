package usecase

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/password"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

type UserUsecase interface {
	Authenticate(creds entity.Credentials) (entity.UserResponse, string, error)
	GetAllUser() ([]entity.UserResponse, error)
	GetUser(id string) (entity.UserResponse, error)
	CreateUser(user entity.User) error
	UpdateUser(user entity.User) error
	DeleteUser(id string) error
}

type userUsecaseImpl struct {
	repo     repository.UserRepository
	password password.Password
	config   config.Config
}

func NewUserUsecase(repo repository.UserRepository, password password.Password, config config.Config) UserUsecase {
	return &userUsecaseImpl{repo: repo, password: password, config: config}
}

func (u *userUsecaseImpl) Authenticate(creds entity.Credentials) (entity.UserResponse, string, error) {

	user := entity.User{}

	err := u.repo.GetUser(creds.UserID, &user)
	if err != nil {
		storedUserID := os.Getenv("ID")
		storedPassword := os.Getenv("PASS")

		if creds.UserID == storedUserID && creds.Password == storedPassword {
			hashPassword, err := u.password.HashPassword(creds.Password)
			if err != nil {
				return u.convertToUserResponse(user), "", ErrInternalServer
			}
			user = entity.User{
				ID:       creds.UserID,
				Password: hashPassword,
				Name:     creds.UserID,
			}
		} else {
			return u.convertToUserResponse(user), "", ErrInvalidCredentials
		}
	}

	err = u.password.CheckPassword(user.Password, creds.Password)
	if err != nil {
		return u.convertToUserResponse(user), "", ErrInvalidCredentials
	}

	// JWTトークンの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": creds.UserID,
		"exp":     time.Now().Add(time.Hour * 3).Unix(),
	})

	tokenString, err := token.SignedString(u.config.JWTKey)
	if err != nil {
		return u.convertToUserResponse(user), "", ErrInternalServer
	}
	return u.convertToUserResponse(user), tokenString, nil
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
func (u *userUsecaseImpl) CreateUser(user entity.User) error {
	hashPassword, err := u.password.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashPassword

	return u.repo.CreateUser(&user)
}
func (u *userUsecaseImpl) UpdateUser(user entity.User) error {
	preUser := entity.User{}
	err := u.repo.GetUser(user.ID, &preUser)
	if err != nil {
		return err
	}
	//更新値の設定
	preUser.Name = user.Name
	preUser.GroupID = user.GroupID

	return u.repo.UpdateUser(&preUser)
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
