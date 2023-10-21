package usecase

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/repository"
	"github.com/ten313/HouseholdAccountBook/app/infrastructure/config"
	"github.com/ten313/HouseholdAccountBook/app/pass"
)

var ErrInternalServer = errors.New("internal server error")

type AuthUsecase interface {
	Authenticate(creds entity.Credentials) (*entity.User, string, error)
}

type authUsecaseImpl struct {
	repo   repository.UserRepository
	config config.Config
}

func NewAuthUsecase(repo repository.UserRepository, config config.Config) AuthUsecase {
	return &authUsecaseImpl{repo: repo, config: config}
}

func (a *authUsecaseImpl) Authenticate(creds entity.Credentials) (*entity.User, string, error) {

	user, err := a.repo.GetUser(creds.UserID)
	if err != nil {
		storedUserID := os.Getenv("ID")
		storedPassword := os.Getenv("PASS")

		if creds.UserID == storedUserID && creds.Password == storedPassword {
			hashPassword, err := pass.HashPassword(creds.Password)
			if err != nil {
				return nil, "", ErrInternalServer
			}
			var userDefault = entity.User{
				ID:       creds.UserID,
				Password: hashPassword,
				Name:     creds.UserID,
			}
			user = &userDefault
		} else {
			return nil, "", ErrInternalServer
		}
	}

	if !pass.CheckPassword(user.Password, creds.Password) {
		return nil, "", ErrInternalServer
	}

	// JWTトークンの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": creds.UserID,
		"exp":     time.Now().Add(time.Hour * 3).Unix(),
	})

	tokenString, err := token.SignedString(a.config.JWTKey)
	if err != nil {
		return nil, "", ErrInternalServer
	}
	return user, tokenString, nil
}
