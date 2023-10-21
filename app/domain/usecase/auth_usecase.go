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

type AuthUsecase interface {
	Authenticate(creds entity.Credentials) (entity.User, string, error)
}

type authUsecaseImpl struct {
	repo     repository.UserRepository
	password password.Password
	config   config.Config
}

func NewAuthUsecase(repo repository.UserRepository, password password.Password, config config.Config) AuthUsecase {
	return &authUsecaseImpl{repo: repo, password: password, config: config}
}

func (a *authUsecaseImpl) Authenticate(creds entity.Credentials) (entity.User, string, error) {

	user := entity.User{}

	err := a.repo.GetUser(creds.UserID, &user)
	if err != nil {
		storedUserID := os.Getenv("ID")
		storedPassword := os.Getenv("PASS")

		if creds.UserID == storedUserID && creds.Password == storedPassword {
			hashPassword, err := a.password.HashPassword(creds.Password)
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

	if !a.password.CheckPassword(user.Password, creds.Password) {
		return user, "", ErrInternalServer
	}

	// JWTトークンの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": creds.UserID,
		"exp":     time.Now().Add(time.Hour * 3).Unix(),
	})

	tokenString, err := token.SignedString(a.config.JWTKey)
	if err != nil {
		return user, "", ErrInternalServer
	}
	return user, tokenString, nil
}
