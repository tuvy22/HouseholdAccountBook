package context_utils

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func GetLoginUserID(c *gin.Context) (string, error) {
	userId, exists := c.Get("user_id")
	if !exists {
		return "", fmt.Errorf("User ID not found in context")
	}

	userIdStr, ok := userId.(string)
	if !ok {
		return "", fmt.Errorf("User ID is not a string")
	}

	return userIdStr, nil

}
