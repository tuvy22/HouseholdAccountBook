package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Expense struct {
	ID       uint   `gorm:"primaryKey"`
	Category string `json:"category"`
	Amount   string `json:"amount"`
	Memo     string `json:"memo"`
	Date     string `json:"date"`
	SortAt   string `json:"sortAt"`
}

var db *gorm.DB

func init() {
	dsn := "root:root@tcp(192.168.99.100:3306)/expenses?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	db.AutoMigrate(&Expense{})
}

func getDummyData(c *gin.Context) {
	dummyExpenses := []Expense{
		{ID: 1, Category: "Food", Amount: "1000", Memo: "Lunch", Date: "2023-09-03", SortAt: "12:00"},
		{ID: 2, Category: "Transport", Amount: "200", Memo: "Bus", Date: "2023-09-03", SortAt: "09:00"},
	}

	c.JSON(http.StatusOK, dummyExpenses)
}

func getExpenses(c *gin.Context) {
	var expenses []Expense
	db.Order("Date desc, sort_at desc").Find(&expenses)
	c.JSON(http.StatusOK, expenses)
}

func createExpense(c *gin.Context) {
	var expense Expense
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Create(&expense).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, expense)
}

func updateExpense(c *gin.Context) {
	id := c.Param("id")
	var expense Expense

	if err := db.First(&expense, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Expense not found"})
		return
	}

	var newExpense Expense
	if err := c.ShouldBindJSON(&newExpense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&expense).Updates(newExpense).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, expense)
}

func main() {
	r := gin.Default()

	// CORS 設定
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://192.168.99.100:3000"} // 許可するオリジン
	r.Use(cors.New(config))

	r.GET("/dummy", getDummyData)
	r.GET("/expenses", getExpenses)
	r.POST("/expenses", createExpense)
	r.PUT("/expenses/:id", updateExpense)

	r.Run(":8080")
}
