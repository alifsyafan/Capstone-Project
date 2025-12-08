package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StringArray custom type for PostgreSQL array
type StringArray []string

// Scan implements the sql.Scanner interface
func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = []string{}
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to scan StringArray")
	}
	return json.Unmarshal(bytes, s)
}

// Value implements the driver.Valuer interface
func (s StringArray) Value() (driver.Value, error) {
	if s == nil {
		return "[]", nil
	}
	return json.Marshal(s)
}

// Base model with UUID
type BaseModel struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate hook to generate UUID
func (base *BaseModel) BeforeCreate(tx *gorm.DB) error {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return nil
}

// Admin model for authentication
type Admin struct {
	BaseModel
	Username    string `gorm:"uniqueIndex;not null;size:50" json:"username"`
	Password    string `gorm:"not null" json:"-"`
	Email       string `gorm:"uniqueIndex;not null;size:100" json:"email"`
	NamaLengkap string `gorm:"size:100" json:"nama_lengkap"`
	IsActive    bool   `gorm:"default:true" json:"is_active"`
}

// JenisPerizinan model
type JenisPerizinan struct {
	BaseModel
	Nama        string      `gorm:"not null;size:100" json:"nama"`
	Deskripsi   string      `gorm:"type:text" json:"deskripsi"`
	Persyaratan StringArray `gorm:"type:jsonb" json:"persyaratan"`
	Aktif       bool        `gorm:"default:true" json:"aktif"`
}

// Pemohon model (embedded in Permohonan or separate table)
type Pemohon struct {
	BaseModel
	NamaLengkap  string `gorm:"not null;size:100" json:"nama_lengkap"`
	NomorTelepon string `gorm:"size:20" json:"nomor_telepon"`
	Email        string `gorm:"not null;size:100" json:"email"`
	Alamat       string `gorm:"type:text" json:"alamat"`
}

// StatusPermohonan enum
type StatusPermohonan string

const (
	StatusBaru      StatusPermohonan = "baru"
	StatusDiproses  StatusPermohonan = "diproses"
	StatusDisetujui StatusPermohonan = "disetujui"
	StatusDitolak   StatusPermohonan = "ditolak"
)

// Permohonan model
type Permohonan struct {
	BaseModel
	PemohonID        uuid.UUID        `gorm:"type:uuid;not null" json:"pemohon_id"`
	Pemohon          Pemohon          `gorm:"foreignKey:PemohonID" json:"pemohon"`
	JenisPerizinanID uuid.UUID        `gorm:"type:uuid;not null" json:"jenis_perizinan_id"`
	JenisPerizinan   JenisPerizinan   `gorm:"foreignKey:JenisPerizinanID" json:"jenis_perizinan"`
	Berkas           []Berkas         `gorm:"foreignKey:PermohonanID" json:"berkas"`
	Catatan          string           `gorm:"type:text" json:"catatan"`
	Status           StatusPermohonan `gorm:"type:varchar(20);default:'baru'" json:"status"`
	TanggalMasuk     time.Time        `gorm:"not null" json:"tanggal_masuk"`
	TanggalDiproses  *time.Time       `json:"tanggal_diproses"`
	TanggalSelesai   *time.Time       `json:"tanggal_selesai"`
	BalasanEmail     string           `gorm:"type:text" json:"balasan_email"`
	CatatanAdmin     string           `gorm:"type:text" json:"catatan_admin"`
	DikelolaOleh     *uuid.UUID       `gorm:"type:uuid" json:"dikelola_oleh"`
	Admin            *Admin           `gorm:"foreignKey:DikelolaOleh" json:"admin,omitempty"`
}

// Berkas model for file uploads
type Berkas struct {
	BaseModel
	PermohonanID uuid.UUID `gorm:"type:uuid;not null" json:"permohonan_id"`
	NamaFile     string    `gorm:"not null;size:255" json:"nama_file"`
	NamaAsli     string    `gorm:"not null;size:255" json:"nama_asli"`
	Path         string    `gorm:"not null;size:500" json:"path"`
	Ukuran       int64     `json:"ukuran"`
	MimeType     string    `gorm:"size:100" json:"mime_type"`
}

// Notifikasi model
type Notifikasi struct {
	BaseModel
	AdminID      uuid.UUID  `gorm:"type:uuid;not null" json:"admin_id"`
	Admin        Admin      `gorm:"foreignKey:AdminID" json:"-"`
	PermohonanID uuid.UUID  `gorm:"type:uuid;not null" json:"permohonan_id"`
	Permohonan   Permohonan `gorm:"foreignKey:PermohonanID" json:"-"`
	Pesan        string     `gorm:"type:text;not null" json:"pesan"`
	Dibaca       bool       `gorm:"default:false" json:"dibaca"`
	Tanggal      time.Time  `gorm:"not null" json:"tanggal"`
}

// EmailLog model for tracking sent emails
type EmailLog struct {
	BaseModel
	PermohonanID uuid.UUID  `gorm:"type:uuid;not null" json:"permohonan_id"`
	EmailTujuan  string     `gorm:"not null;size:100" json:"email_tujuan"`
	Subjek       string     `gorm:"not null;size:255" json:"subjek"`
	Isi          string     `gorm:"type:text;not null" json:"isi"`
	Status       string     `gorm:"size:20" json:"status"` // sent, failed
	Error        string     `gorm:"type:text" json:"error"`
	SentAt       *time.Time `json:"sent_at"`
}
