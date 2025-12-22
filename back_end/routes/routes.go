package routes

import (
	"github.com/alifsyafan/backend-capston/controllers"
	"github.com/alifsyafan/backend-capston/middleware"
	"github.com/alifsyafan/backend-capston/models"
	"github.com/alifsyafan/backend-capston/services"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	router *gin.Engine,
	authController *controllers.AuthController,
	jenisPerizinanController *controllers.JenisPerizinanController,
	permohonanController *controllers.PermohonanController,
	notifikasiController *controllers.NotifikasiController,
	adminController *controllers.AdminController,
	authService services.AuthService,
) {
	// API v1 group
	api := router.Group("/api/v1")

	// Public routes (no authentication required)
	public := api.Group("")
	{
		// Auth routes
		public.POST("/auth/login", authController.Login)

		// Public jenis perizinan (for form dropdown)
		public.GET("/jenis-perizinan", jenisPerizinanController.GetAll)
		public.GET("/jenis-perizinan/:id", jenisPerizinanController.GetByID)

		// Public permohonan submission
		public.POST("/permohonan", permohonanController.Create)
	}

	// Protected routes (authentication required - all admin roles can access)
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware(authService))
	{
		// Auth routes - accessible by all authenticated admins
		protected.GET("/auth/profile", authController.GetProfile)
		protected.POST("/auth/change-password", adminController.ChangePassword)

		// Admin - Permohonan management (accessible by all admin roles)
		protected.GET("/admin/permohonan", permohonanController.GetAll)
		protected.GET("/admin/permohonan/:id", permohonanController.GetByID)
		protected.GET("/admin/permohonan/status/:status", permohonanController.GetByStatus)
		protected.PATCH("/admin/permohonan/:id/status", permohonanController.UpdateStatus)
		protected.POST("/admin/permohonan/:id/balasan", permohonanController.KirimBalasan)

		// Admin - Dashboard (accessible by all admin roles)
		protected.GET("/admin/dashboard/statistik", permohonanController.GetStatistik)
		protected.GET("/admin/dashboard/recent", permohonanController.GetRecentPermohonan)

		// Admin - Notifikasi (accessible by all admin roles)
		protected.GET("/admin/notifikasi", notifikasiController.GetAll)
		protected.GET("/admin/notifikasi/count", notifikasiController.CountUnread)
		protected.PATCH("/admin/notifikasi/:id/read", notifikasiController.MarkAsRead)
		protected.PATCH("/admin/notifikasi/read-all", notifikasiController.MarkAllAsRead)
	}

	// Super Admin only routes (for managing perizinan types and admins)
	superAdminRoutes := api.Group("")
	superAdminRoutes.Use(middleware.AuthMiddleware(authService))
	superAdminRoutes.Use(middleware.RoleMiddleware(models.RoleSuperAdmin))
	{
		// Super Admin - Jenis Perizinan CRUD (only super_admin can manage)
		superAdminRoutes.POST("/admin/jenis-perizinan", jenisPerizinanController.Create)
		superAdminRoutes.PUT("/admin/jenis-perizinan/:id", jenisPerizinanController.Update)
		superAdminRoutes.DELETE("/admin/jenis-perizinan/:id", jenisPerizinanController.Delete)

		// Super Admin - Admin Management CRUD
		superAdminRoutes.GET("/admin/admins", adminController.GetAll)
		superAdminRoutes.POST("/admin/admins", adminController.Create)
		superAdminRoutes.GET("/admin/admins/:id", adminController.GetByID)
		superAdminRoutes.PUT("/admin/admins/:id", adminController.Update)
		superAdminRoutes.DELETE("/admin/admins/:id", adminController.Delete)
		superAdminRoutes.POST("/admin/admins/:id/reset-password", adminController.ResetPassword)
	}

	// Serve uploaded files with download endpoint
	router.GET("/download/:filename", permohonanController.DownloadFile)
	router.Static("/uploads", "./uploads")
}
