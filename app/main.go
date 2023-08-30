package main

import (
	"github.com/gin-gonic/gin"
	// _ "github.com/go-sql-driver/mysql"
	"github.com/gin-contrib/cors" // このパッケージをインポート
)

// type Expense struct {
// 	Category string `json:"category"`
// 	Amount   string `json:"amount"`
// 	Memo     string `json:"memo"`
// 	Date     string `json:"date"`
// }

// var db *sql.DB
// var err error

func main() {

	// db, err = sql.Open("mysql", "username:password@tcp(localhost:3306)/dbname")
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// err = db.Ping()
	// if err != nil {
	// 	fmt.Println(err)
	// }

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// r.GET("/expenses", GetExpenses)
	// r.POST("/expense", CreateExpense)

	r.GET("/expenses", func(c *gin.Context) {
		// ダミーの支出データ
		expenses := []map[string]interface{}{
			{"date": "2023-08-28", "category": "Food", "amount": 2000, "memo": "Lunch"},
			{"date": "2023-08-27", "category": "Transport", "amount": 150, "memo": "Bus fare"},
		}

		// JSONとしてレスポンスを返す
		c.JSON(200, expenses)
	})

	r.Run(":8080")
}

// func CreateExpense(c *gin.Context) {
// 	var expense Expense
// 	c.BindJSON(&expense)

// 	_, err = db.Query("INSERT INTO expenses (category, amount, memo, date) VALUES (?, ?, ?, ?)", expense.Category, expense.Amount, expense.Memo, expense.Date)
// 	if err != nil {
// 		fmt.Println(err)
// 	} else {
// 		c.JSON(200, gin.H{
// 			"message": "Successfully created expense!",
// 		})
// 	}
// }

// func GetExpenses(c *gin.Context) {
// 	rows, err := db.Query("SELECT category, amount, memo, date from expenses")
// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	expenses := []Expense{}

// 	for rows.Next() {
// 		var expense Expense
// 		rows.Scan(&expense.Category, &expense.Amount, &expense.Memo, &expense.Date)
// 		expenses = append(expenses, expense)
// 	}

// 	c.JSON(200, expenses)
// }
