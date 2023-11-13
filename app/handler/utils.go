package handler

import (
	"fmt"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/ten313/HouseholdAccountBook/app/customerrors"
	"github.com/ten313/HouseholdAccountBook/app/domain/entity"
)

func GetLoginUser(c *gin.Context) (entity.UserResponse, error) {
	// セッションからデータを取得
	session := sessions.Default(c)
	user := session.Get("user")
	userSession, ok := user.(entity.UserSession)
	if !ok {
		return entity.UserResponse{}, customerrors.NewCustomError(customerrors.ErrInvalidCredentials)
	}
	userResponse := entity.UserResponse{
		ID:            userSession.ID,
		Name:          userSession.Name,
		GroupID:       userSession.GroupID,
		InitialAmount: userSession.InitialAmount,
	}

	return userResponse, nil
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
