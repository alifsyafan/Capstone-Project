package middleware

import (
	"net/http"
	"strings"

	"github.com/alifsyafan/backend-capston/dto"
	"github.com/alifsyafan/backend-capston/models"
	"github.com/alifsyafan/backend-capston/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// AuthMiddleware checks if the request has a valid JWT token
func AuthMiddleware(authService services.AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get token from Authorization header
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
				Success: false,
				Message: "Token tidak ditemukan",
			})
			ctx.Abort()
			return
		}

		// Check Bearer prefix
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
				Success: false,
				Message: "Format token tidak valid",
			})
			ctx.Abort()
			return
		}

		tokenString := parts[1]

		// Validate token
		claims, err := authService.ValidateToken(tokenString)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
				Success: false,
				Message: "Token tidak valid atau sudah kadaluarsa",
				Error:   err.Error(),
			})
			ctx.Abort()
			return
		}

		// Extract admin_id from claims
		adminIDStr, ok := (*claims)["admin_id"].(string)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
				Success: false,
				Message: "Token tidak valid",
			})
			ctx.Abort()
			return
		}

		adminID, err := uuid.Parse(adminIDStr)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
				Success: false,
				Message: "Token tidak valid",
			})
			ctx.Abort()
			return
		}

		// Extract role from claims
		role, _ := (*claims)["role"].(string)

		// Set admin_id, username, and role in context
		ctx.Set("admin_id", adminID)
		ctx.Set("username", (*claims)["username"])
		ctx.Set("role", role)

		ctx.Next()
	}
}

// RoleMiddleware checks if the user has the required role
func RoleMiddleware(allowedRoles ...models.RoleAdmin) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		roleStr, exists := ctx.Get("role")
		if !exists {
			ctx.JSON(http.StatusForbidden, dto.APIResponse{
				Success: false,
				Message: "Akses ditolak: role tidak ditemukan",
			})
			ctx.Abort()
			return
		}

		userRole := models.RoleAdmin(roleStr.(string))

		// Check if user's role is in allowed roles
		allowed := false
		for _, role := range allowedRoles {
			if userRole == role {
				allowed = true
				break
			}
		}

		if !allowed {
			ctx.JSON(http.StatusForbidden, dto.APIResponse{
				Success: false,
				Message: "Akses ditolak: Anda tidak memiliki izin untuk mengakses fitur ini",
			})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

// CORSMiddleware handles CORS
func CORSMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		ctx.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if ctx.Request.Method == "OPTIONS" {
			ctx.AbortWithStatus(http.StatusNoContent)
			return
		}

		ctx.Next()
	}
}
