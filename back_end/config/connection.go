package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Config holds all configuration for the application
type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	ServerPort string
	GinMode    string

	JWTSecret      string
	JWTExpiryHours string

	AdminUsername string
	AdminPassword string
	AdminEmail    string

	SMTPHost     string
	SMTPPort     string
	SMTPUsername string
	SMTPPassword string
	SMTPFrom     string

	UploadPath  string
	MaxFileSize string
}

// LoadConfig loads configuration from .env file
func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", "dinkes_perizinan"),
		DBSSLMode:  getEnv("DB_SSLMODE", "disable"),

		ServerPort: getEnv("SERVER_PORT", "8080"),
		GinMode:    getEnv("GIN_MODE", "debug"),

		JWTSecret:      getEnv("JWT_SECRET", "secret"),
		JWTExpiryHours: getEnv("JWT_EXPIRY_HOURS", "24"),

		AdminUsername: getEnv("ADMIN_USERNAME", "admin"),
		AdminPassword: getEnv("ADMIN_PASSWORD", "admin123"),
		AdminEmail:    getEnv("ADMIN_EMAIL", "admin@dinkes.makassar.go.id"),

		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUsername: getEnv("SMTP_USERNAME", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", ""),

		UploadPath:  getEnv("UPLOAD_PATH", "./uploads"),
		MaxFileSize: getEnv("MAX_FILE_SIZE", "10485760"),
	}
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

// ConnectDatabase establishes database connection
func ConnectDatabase(cfg *Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FMakassar",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	DB = db
	log.Println("✅ Database connected successfully")
	return db, nil
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}
