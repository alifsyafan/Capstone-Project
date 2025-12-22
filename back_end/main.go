package main

import (
	"log"
	"os"

	"github.com/alifsyafan/backend-capston/config"
	"github.com/alifsyafan/backend-capston/controllers"
	"github.com/alifsyafan/backend-capston/middleware"
	"github.com/alifsyafan/backend-capston/models"
	"github.com/alifsyafan/backend-capston/repositories"
	"github.com/alifsyafan/backend-capston/routes"
	"github.com/alifsyafan/backend-capston/services"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Connect to database
	db, err := config.ConnectDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto migrate models
	err = db.AutoMigrate(
		&models.Admin{},
		&models.JenisPerizinan{},
		&models.Pemohon{},
		&models.Permohonan{},
		&models.Berkas{},
		&models.Notifikasi{},
		&models.EmailLog{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("✅ Database migrated successfully")

	// Run role migration for existing admins
	migrateAdminRoles(db)

	// Initialize repositories
	adminRepo := repositories.NewAdminRepository(db)
	jpRepo := repositories.NewJenisPerizinanRepository(db)
	pemohonRepo := repositories.NewPemohonRepository(db)
	permohonanRepo := repositories.NewPermohonanRepository(db)
	notifRepo := repositories.NewNotifikasiRepository(db)
	emailLogRepo := repositories.NewEmailLogRepository(db)

	// Create default admin if not exists
	createDefaultAdmin(adminRepo, cfg)

	// Create default jenis perizinan if not exists
	createDefaultJenisPerizinan(jpRepo)

	// Initialize services
	authService := services.NewAuthService(adminRepo, cfg)
	adminService := services.NewAdminService(adminRepo)
	jpService := services.NewJenisPerizinanService(jpRepo)
	emailService := services.NewEmailService(cfg, emailLogRepo)
	permohonanService := services.NewPermohonanService(permohonanRepo, pemohonRepo, jpRepo, notifRepo, adminRepo, emailService)
	notifService := services.NewNotifikasiService(notifRepo)

	// Initialize controllers
	authController := controllers.NewAuthController(authService)
	adminController := controllers.NewAdminController(adminService)
	jpController := controllers.NewJenisPerizinanController(jpService)
	permohonanController := controllers.NewPermohonanController(permohonanService, cfg.UploadPath)
	notifController := controllers.NewNotifikasiController(notifService)

	// Create uploads directory
	os.MkdirAll(cfg.UploadPath, os.ModePerm)

	// Setup router
	router := gin.Default()

	// Apply CORS middleware
	router.Use(middleware.CORSMiddleware())

	// Setup routes
	routes.SetupRoutes(
		router,
		authController,
		jpController,
		permohonanController,
		notifController,
		adminController,
		authService,
	)

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Dinas Kesehatan Perizinan API is running",
		})
	})

	// Start server
	port := cfg.ServerPort
	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📝 API Documentation: http://localhost:%s/api/v1", port)

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func createDefaultAdmin(adminRepo repositories.AdminRepository, cfg *config.Config) {
	// Check if admin already exists
	_, err := adminRepo.FindByUsername(cfg.AdminUsername)
	if err == nil {
		log.Println("ℹ️  Default admin already exists")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Warning: Failed to hash admin password: %v", err)
		return
	}

	admin := &models.Admin{
		Username:    cfg.AdminUsername,
		Password:    string(hashedPassword),
		Email:       cfg.AdminEmail,
		NamaLengkap: "Administrator",
		Role:        models.RoleSuperAdmin, // Set default admin as super_admin
		IsActive:    true,
	}

	err = adminRepo.Create(admin)
	if err != nil {
		log.Printf("Warning: Failed to create default admin: %v", err)
		return
	}

	log.Println("✅ Default admin created successfully (Role: Super Admin)")
	log.Printf("   Username: %s", cfg.AdminUsername)
	log.Printf("   Password: %s", cfg.AdminPassword)
}

// migrateAdminRoles migrates existing admins without role to super_admin
func migrateAdminRoles(db *gorm.DB) {
	// Update all admins with empty or null role to super_admin
	result := db.Model(&models.Admin{}).
		Where("role IS NULL OR role = '' OR role = 'admin'").
		Where("username = ?", "admin"). // Only update the first/default admin
		Update("role", models.RoleSuperAdmin)

	if result.Error != nil {
		log.Printf("Warning: Failed to migrate admin roles: %v", result.Error)
		return
	}

	if result.RowsAffected > 0 {
		log.Printf("✅ Migrated %d admin(s) to super_admin role", result.RowsAffected)
	}
}

func createDefaultJenisPerizinan(jpRepo repositories.JenisPerizinanRepository) {
	// Check if any jenis perizinan exists
	list, _ := jpRepo.FindAll(false)
	if len(list) > 0 {
		log.Println("ℹ️  Jenis perizinan already exists")
		return
	}

	// Create default jenis perizinan
	defaultJP := []models.JenisPerizinan{
		{
			Nama:        "Izin Penelitian",
			Deskripsi:   "Izin untuk melakukan penelitian di lingkungan Dinas Kesehatan",
			Persyaratan: models.StringArray{"Surat pengantar dari instansi", "Proposal penelitian", "KTP"},
			Aktif:       true,
		},
		{
			Nama:        "Izin Pengambilan Data Awal",
			Deskripsi:   "Izin untuk survei pendahuluan atau pengambilan data awal",
			Persyaratan: models.StringArray{"Surat pengantar", "Proposal"},
			Aktif:       true,
		},
		{
			Nama:        "Izin Permohonan Magang",
			Deskripsi:   "Izin untuk PKL/Magang di Dinas Kesehatan",
			Persyaratan: models.StringArray{"Surat dari kampus", "CV", "Transkrip nilai"},
			Aktif:       true,
		},
		{
			Nama:        "Izin Kepaniteraan Klinik (Coas)",
			Deskripsi:   "Izin untuk mahasiswa profesi kesehatan",
			Persyaratan: models.StringArray{"Surat pengantar fakultas", "Logbook"},
			Aktif:       true,
		},
		{
			Nama:        "Izin Kunjungan Lapangan",
			Deskripsi:   "Izin untuk kunjungan studi banding atau observasi lapangan",
			Persyaratan: models.StringArray{"Surat permohonan resmi", "Daftar peserta"},
			Aktif:       true,
		},
	}

	for _, jp := range defaultJP {
		err := jpRepo.Create(&jp)
		if err != nil {
			log.Printf("Warning: Failed to create jenis perizinan '%s': %v", jp.Nama, err)
		}
	}

	log.Println("✅ Default jenis perizinan created successfully")
}
