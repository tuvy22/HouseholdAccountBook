package usecase

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/password"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
)

var ErrInternalServer = errors.New("internal server error")

type UserUsecase interface {
	Authenticate(creds entity.Credentials) (entity.User, string, error)
	GetAllUser() ([]entity.User, error)
	GetUser(id string) (entity.User, error)
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

func (u *userUsecaseImpl) Authenticate(creds entity.Credentials) (entity.User, string, error) {

	user := entity.User{}

	err := u.repo.GetUser(creds.UserID, &user)
	if err != nil {
		storedUserID := os.Getenv("ID")
		storedPassword := os.Getenv("PASS")

		if creds.UserID == storedUserID && creds.Password == storedPassword {
			hashPassword, err := u.password.HashPassword(creds.Password)
			if err != nil {
				return user, "", ErrInternalServer
			}
			user = entity.User{
				ID:       creds.UserID,
				Password: hashPassword,
				Name:     creds.UserID,
			}
		} else {
			return user, "", ErrInternalServer
		}
	}

	if !u.password.CheckPassword(user.Password, creds.Password) {
		return user, "", ErrInternalServer
	}

	// JWTトークンの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": creds.UserID,
		"exp":     time.Now().Add(time.Hour * 3).Unix(),
	})

	tokenString, err := token.SignedString(u.config.JWTKey)
	if err != nil {
		return user, "", ErrInternalServer
	}
	return user, tokenString, nil
}
func (u *userUsecaseImpl) GetAllUser() ([]entity.User, error) {
	users := []entity.User{}

	err := u.repo.GetAllUser(&users)
	if err != nil {
		return users, err
	}

	return users, nil
}
func (u *userUsecaseImpl) GetUser(id string) (entity.User, error) {
	user := entity.User{}

	err := u.repo.GetUser(id, &user)
	if err != nil {
		return user, err
	}

	return user, nil
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

	return u.repo.UpdateUser(&user)
}
func (u *userUsecaseImpl) DeleteUser(id string) error {

	return u.repo.DeleteUser(id)
}
