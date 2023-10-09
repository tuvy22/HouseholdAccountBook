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
	ID             uint   `gorm:"primaryKey"`
	Category       string `json:"category" gorm:"column:category"`
	Amount         int    `json:"amount" gorm:"column:amount"`
	Memo           string `json:"memo" gorm:"column:memo"`
	Date           string `json:"date" gorm:"column:date"`
	SortAt         string `json:"sortAt" gorm:"column:sort_at"`
	RegisterUserID string `json:"registerUserId" gorm:"column:register_user_id"`
}
type User struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Password string `json:"password" gorm:"column:Password"`
	Name     string `json:"name" gorm:"column:name"`
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

	// storedUserID := os.Getenv("ID")
	// storedPassword := os.Getenv("PASS")

	// var user User
	// var err error
	// if creds.UserID == storedUserID && creds.Password == storedPassword {
	// 	user = User{
	// 		ID:       creds.UserID,
	// 		Password: "XXXXXXXX",
	// 		Name:     creds.UserID,
	// 	}

	// } else {
	user, err := getUserByID(creds.UserID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
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
	log.Println(expense)

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
	public.POST("/user/register", idRegister)

	localhost := r.Group("/api/localhost/")
	localhost.Use(localhostOnly())
	localhost.GET("/expenses", getExpenses)

	authorized := r.Group("/api/private/")
	authorized.Use(checkToken())
	authorized.POST("/auth-del", authDel)
	authorized.GET("/check-auth", checkAuth)
	authorized.GET("/user", getUser)
	authorized.POST("/expenses", createExpense)
	authorized.PUT("/expenses/:id", updateExpense)

	r.Run(":8080")
}
