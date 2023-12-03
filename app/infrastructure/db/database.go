package db

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
	"github.com/ten313/HouseholdAccountBook/app/domain/logger"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	db  *gorm.DB
	log logger.Logger
)

func GetDB() *gorm.DB {
	return db
}

func init() {
	log = logger.NewLogrusLogger()

	// .env ファイルから環境変数をロード
	if err := godotenv.Load(); err != nil {
		log.Warn("No .env file found")
	}

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		log.ErrorMsg("DATABASE_DSN environment variable is not set")
		os.Exit(1) // エラー発生時にプログラムを終了
	}

	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Error(err)
		os.Exit(1) // エラー発生時にプログラムを終了
	}
	// ドロップ
	//db.Migrator().DropTable(&entity.IncomeAndExpense{}, &entity.IncomeAndExpenseBillingUser{}, &entity.Liquidation{})

	// テーブルを自動マイグレーション
	db.AutoMigrate(&entity.IncomeAndExpense{}, &entity.User{}, &entity.Group{}, &entity.IncomeAndExpenseBillingUser{}, &entity.Liquidation{}, &entity.Category{})

}
