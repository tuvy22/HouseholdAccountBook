package handler

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
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

func GetInviteGroupID(c *gin.Context) (uint, error) {
	groupId, exists := c.Get("group_id")
	if !exists {
		//招待時以外は存在しないため、エラーではない
		return entity.GroupIDNone, nil
	}

	groupIdUint, ok := groupId.(uint)
	if !ok {
		return entity.GroupIDNone, fmt.Errorf("Group ID is not a uint")
	}

	return groupIdUint, nil

}
