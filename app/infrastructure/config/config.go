package config

import "os"

type Config struct {
	LoginJWTKey  []byte
	InviteJWTKey []byte
}

func LoadConfig() Config {
	return Config{
		LoginJWTKey:  []byte(os.Getenv("LOGIN_JWT_SECRET_KEY")),
		InviteJWTKey: []byte(os.Getenv("INVITE_JWT_SECRET_KEY")),
	}
}
