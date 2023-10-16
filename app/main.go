package main

import (
	"fmt"
	"go-prj/pass"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Expense struct {
	ID             uint   `json:"id" gorm:"primaryKey"`
	Category       string `json:"category" gorm:"column:category"`
	Amount         int    `json:"amount" gorm:"column:amount"`
	Memo           string `json:"memo" gorm:"column:memo"`
	Date           string `json:"date" gorm:"column:date"`
	SortAt         string `json:"sortAt" gorm:"column:sort_at"`
	RegisterUserID string `json:"registerUserId" gorm:"column:register_user_id"`
}
type User struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Password string `gorm:"column:Password"`
	Name     string `json:"name" gorm:"column:name"`
	GroupID  uint   `json:"groupId" gorm:"column:group_id"`
}

type Credentials struct {
	UserID   string `json:"userId"`
	Password string `json:"password"`
}

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

var db *gorm.DB

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
	db.AutoMigrate(&Expense{})
	db.AutoMigrate(&User{})
}

func auth(c *gin.Context) {
	var creds Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := getUserByID(creds.UserID)
	if err != nil {
		storedUserID := os.Getenv("ID")
		storedPassword := os.Getenv("PASS")

		if creds.UserID == storedUserID && creds.Password == storedPassword {
			hashPassword, err := pass.HashPassword(creds.Password)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			var userDefault = User{
				ID:       creds.UserID,
				Password: hashPassword,
				Name:     creds.UserID,
			}
			user = &userDefault
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
	}

	if !pass.CheckPassword(user.Password, creds.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	}

	// JWTトークンの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": creds.UserID,
		"exp":     time.Now().Add(time.Hour * 3).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// クッキーにトークンを保存(L)
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("jwt", tokenString, 3600, "/", os.Getenv("ALLOWED_ORIGINS"), true, false)
	c.JSON(http.StatusOK, user)
}

func idRegister(c *gin.Context) {
	var inputUser User
	if err := c.ShouldBindJSON(&inputUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println(inputUser)
	hashPassword, err := pass.HashPassword(inputUser.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	user := User{
		ID:       inputUser.ID,
		Password: hashPassword,
		Name:     inputUser.Name,
	}

	if err := db.Create(&user).Error; err != nil {
		log.Println("Error Creating Expense:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)

}

func authDel(c *gin.Context) {
	// トークンを持つクッキーの有効期限を過去の日時に設定して削除
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("jwt", "", -1, "/", os.Getenv("ALLOWED_ORIGINS"), true, false)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func getExpenses(c *gin.Context) {
	var expenses []Expense
	db.Order("Date desc, sort_at desc").Find(&expenses)
	c.JSON(http.StatusOK, expenses)
}

func getUserAll(c *gin.Context) {
	var users []User
	db.Order("id").Find(&users)
	c.JSON(http.StatusOK, users)
}
func deleteUser(c *gin.Context) {
	var user User
	id := c.Param("id")
	if err := db.Where("id = ?", id).Delete(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete expense"})
		return
	}
	c.JSON(200, gin.H{"message": "Expense deleted successfully"})
}

func getUser(c *gin.Context) {
	userIdInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found in context"})
		return
	}
	userId, ok := userIdInterface.(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id was not a string"})
		return
	}

	user, err := getUserByID(userId)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func getUserByID(id string) (*User, error) {
	var user User

	if err := db.Where("id = ?", id).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, gorm.ErrRecordNotFound
		} else {
			return nil, err
		}
	}

	return &user, nil
}

func createExpense(c *gin.Context) {
	var expense Expense
	if err := c.ShouldBindJSON(&expense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found in context"})
		return
	}

	if expense.RegisterUserID != userId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not match"})
		return

	}

	if expense.SortAt == "" {
		expense.SortAt = time.Now().Format(time.RFC3339)
	}
	log.Println(expense)
	if err := db.Create(&expense).Error; err != nil {
		log.Println("Error Creating Expense:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, expense)
}

func deleteExpense(c *gin.Context) {
	var expense Expense
	id := c.Param("id")
	if err := db.Where("id = ?", id).Delete(&expense).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete expense"})
		return
	}
	c.JSON(200, gin.H{"message": "Expense deleted successfully"})
}

func updateExpense(c *gin.Context) {
	var expense Expense
	var updateExpense Expense
	id := c.Param("id")

	if err := db.Where("id = ?", id).First(&expense).Error; err != nil {
		c.JSON(400, gin.H{"error": "Expense not found"})
		return
	}

	if err := c.ShouldBindJSON(&updateExpense); err != nil {
		c.JSON(400, gin.H{"error": "Failed to parse request"})
		return
	}
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not found in context"})
		return
	}

	if updateExpense.RegisterUserID != userId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID not match"})
		return

	}
	if expense.SortAt == "" {
		expense.SortAt = time.Now().Format(time.RFC3339)
	}

	if err := db.Save(&updateExpense).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update expense"})
		return
	}

	c.JSON(200, gin.H{"message": "Expense updated successfully", "data": updateExpense})
}

func checkAuth(c *gin.Context) {
	c.JSON(http.StatusOK, "")
}

func checkToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("jwt")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token not found"})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtKey, nil
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userID := claims["user_id"]
			c.Set("user_id", userID)
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		c.Next()
	}
}
func localhostOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		// リクエストのIPアドレスを取得
		ip := c.ClientIP()

		// IPアドレスがlocalhost (127.0.0.1) または ::1 (IPv6のlocalhost) でない場合、アクセスを拒否
		if !strings.HasPrefix(ip, "127.0.0.1") && !strings.HasPrefix(ip, "::1") {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Access forbidden: only localhost can access."})
			return
		}

		c.Next()
	}
}

func main() {
	r := gin.Default()

	// CORS 設定
	config := cors.DefaultConfig()
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	config.AllowOrigins = strings.Split(allowedOrigins, ",")
	config.AllowCredentials = true
	public := r.Group("/api/public/")
	public.Use(cors.New(config))

	public.POST("/auth", auth)

	localhost := r.Group("/api/localhost/")
	localhost.Use(localhostOnly())
	localhost.GET("/expenses", getExpenses)
	localhost.GET("/user/all", getUserAll)

	authorized := r.Group("/api/private/")
	authorized.Use(checkToken())
	authorized.POST("/auth-del", authDel)
	authorized.GET("/check-auth", checkAuth)
	authorized.POST("/user/register", idRegister)
	authorized.GET("/user", getUser)

	authorized.DELETE("/user/:id", deleteUser)
	authorized.POST("/expense", createExpense)
	authorized.DELETE("/expense/:id", deleteExpense)
	authorized.PUT("/expense/:id", updateExpense)

	r.Run(":8080")
}
