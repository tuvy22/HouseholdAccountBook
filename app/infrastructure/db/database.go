package db

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetDB() *gorm.DB {
	return db
}

func init() {
	// .env ファイルから環境変数をロード
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		log.Fatal("DATABASE_DSN environment variable is not set")
	}

	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	db.AutoMigrate(&entity.IncomeAndExpense{})
	db.AutoMigrate(&entity.User{})
	db.AutoMigrate(&entity.Group{})
}
