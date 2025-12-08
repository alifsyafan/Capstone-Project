package routes

import (
	"github.com/alifsyafan/backend-capston/controllers"
	"github.com/alifsyafan/backend-capston/middleware"
	"github.com/alifsyafan/backend-capston/services"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	router *gin.Engine,
	authController *controllers.AuthController,
	jenisPerizinanController *controllers.JenisPerizinanController,
	permohonanController *controllers.PermohonanController,
	notifikasiController *controllers.NotifikasiController,
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

	// Protected routes (authentication required)
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware(authService))
	{
		// Auth routes
		protected.GET("/auth/profile", authController.GetProfile)

		// Admin - Jenis Perizinan CRUD
		protected.POST("/admin/jenis-perizinan", jenisPerizinanController.Create)
		protected.PUT("/admin/jenis-perizinan/:id", jenisPerizinanController.Update)
		protected.DELETE("/admin/jenis-perizinan/:id", jenisPerizinanController.Delete)

		// Admin - Permohonan management
		protected.GET("/admin/permohonan", permohonanController.GetAll)
		protected.GET("/admin/permohonan/:id", permohonanController.GetByID)
		protected.GET("/admin/permohonan/status/:status", permohonanController.GetByStatus)
		protected.PATCH("/admin/permohonan/:id/status", permohonanController.UpdateStatus)
		protected.POST("/admin/permohonan/:id/balasan", permohonanController.KirimBalasan)

		// Admin - Dashboard
		protected.GET("/admin/dashboard/statistik", permohonanController.GetStatistik)
		protected.GET("/admin/dashboard/recent", permohonanController.GetRecentPermohonan)

		// Admin - Notifikasi
		protected.GET("/admin/notifikasi", notifikasiController.GetAll)
		protected.GET("/admin/notifikasi/count", notifikasiController.CountUnread)
		protected.PATCH("/admin/notifikasi/:id/read", notifikasiController.MarkAsRead)
		protected.PATCH("/admin/notifikasi/read-all", notifikasiController.MarkAllAsRead)
	}

	// Serve uploaded files
	router.Static("/uploads", "./uploads")
}
