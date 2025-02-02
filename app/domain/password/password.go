package password

import (
	"github.com/ten313/HouseholdAccountBook/app/domain/customerrors_unknown"
	"golang.org/x/crypto/bcrypt"
)

type Password interface {
	HashPassword(password string) (string, error)
	CheckPassword(hashedPassword, password string) error
}

type passwordImpl struct{}

func NewPassWord() Password {
	return &passwordImpl{}
}

func (p *passwordImpl) HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", customerrors_unknown.NewCustomErrorUnknown(err)
	}
	return string(hashedPassword), nil
}

func (p *passwordImpl) CheckPassword(hashedPassword, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return customerrors_unknown.NewCustomErrorUnknown(err)
	}
	return nil
}
