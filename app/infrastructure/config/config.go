package config

import "os"

type Config struct {
	JWTKey []byte
}

func LoadConfig() Config {
	return Config{
		JWTKey: []byte(os.Getenv("JWT_SECRET_KEY")),
	}
}
