package dto

import (
	"time"

	"github.com/google/uuid"
)

// ============== Auth DTOs ==============

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	Admin     AdminInfo `json:"admin"`
}

type AdminInfo struct {
	ID          uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	NamaLengkap string    `json:"nama_lengkap"`
	Role        string    `json:"role"`
}

// ============== Jenis Perizinan DTOs ==============

type CreateJenisPerizinanRequest struct {
	Nama        string   `json:"nama" binding:"required"`
	Deskripsi   string   `json:"deskripsi"`
	Persyaratan []string `json:"persyaratan"`
	Aktif       bool     `json:"aktif"`
}

type UpdateJenisPerizinanRequest struct {
	Nama        string   `json:"nama"`
	Deskripsi   string   `json:"deskripsi"`
	Persyaratan []string `json:"persyaratan"`
	Aktif       *bool    `json:"aktif"`
}

type JenisPerizinanResponse struct {
	ID          uuid.UUID `json:"id"`
	Nama        string    `json:"nama"`
	Deskripsi   string    `json:"deskripsi"`
	Persyaratan []string  `json:"persyaratan"`
	Aktif       bool      `json:"aktif"`
	CreatedAt   time.Time `json:"created_at"`
}

// ============== Pemohon DTOs ==============

type PemohonRequest struct {
	NamaLengkap  string `json:"nama_lengkap" binding:"required"`
	NomorTelepon string `json:"nomor_telepon" binding:"required"`
	Email        string `json:"email" binding:"required,email"`
	Alamat       string `json:"alamat" binding:"required"`
}

type PemohonResponse struct {
	ID           uuid.UUID `json:"id"`
	NamaLengkap  string    `json:"nama_lengkap"`
	NomorTelepon string    `json:"nomor_telepon"`
	Email        string    `json:"email"`
	Alamat       string    `json:"alamat"`
}

// ============== Permohonan DTOs ==============

type CreatePermohonanRequest struct {
	Pemohon          PemohonRequest `json:"pemohon" binding:"required"`
	JenisPerizinanID string         `json:"jenis_perizinan_id" binding:"required"`
	Catatan          string         `json:"catatan"`
	// Berkas akan dihandle via multipart form
}

type UpdatePermohonanStatusRequest struct {
	Status       string `json:"status" binding:"required,oneof=baru diproses disetujui ditolak"`
	CatatanAdmin string `json:"catatan_admin"`
}

type KirimBalasanRequest struct {
	BalasanEmail string `json:"balasan_email" binding:"required"`
	Status       string `json:"status" binding:"required,oneof=disetujui ditolak"`
}

type BerkasResponse struct {
	ID        uuid.UUID `json:"id"`
	NamaFile  string    `json:"nama_file"`
	NamaAsli  string    `json:"nama_asli"`
	Path      string    `json:"path"`
	Ukuran    int64     `json:"ukuran"`
	MimeType  string    `json:"mime_type"`
	CreatedAt time.Time `json:"created_at"`
}

type PermohonanResponse struct {
	ID              uuid.UUID              `json:"id"`
	NomorPermohonan string                 `json:"nomor_permohonan"`
	Pemohon         PemohonResponse        `json:"pemohon"`
	JenisPerizinan  JenisPerizinanResponse `json:"jenis_perizinan"`
	Berkas          []BerkasResponse       `json:"berkas"`
	Catatan         string                 `json:"catatan"`
	Status          string                 `json:"status"`
	TanggalMasuk    time.Time              `json:"tanggal_masuk"`
	TanggalDiproses *time.Time             `json:"tanggal_diproses"`
	TanggalSelesai  *time.Time             `json:"tanggal_selesai"`
	BalasanEmail    string                 `json:"balasan_email"`
	CatatanAdmin    string                 `json:"catatan_admin"`
	LampiranSurat   string                 `json:"lampiran_surat"`
	CreatedAt       time.Time              `json:"created_at"`
}

type PermohonanListResponse struct {
	Data       []PermohonanResponse `json:"data"`
	Total      int64                `json:"total"`
	Page       int                  `json:"page"`
	PerPage    int                  `json:"per_page"`
	TotalPages int                  `json:"total_pages"`
}

// ============== Dashboard DTOs ==============

type StatistikDashboard struct {
	TotalPermohonan     int64 `json:"total_permohonan"`
	PermohonanBaru      int64 `json:"permohonan_baru"`
	PermohonanDiproses  int64 `json:"permohonan_diproses"`
	PermohonanSelesai   int64 `json:"permohonan_selesai"`
	PermohonanDisetujui int64 `json:"permohonan_disetujui"`
	PermohonanDitolak   int64 `json:"permohonan_ditolak"`
}

// ============== Notifikasi DTOs ==============

type NotifikasiResponse struct {
	ID           uuid.UUID `json:"id"`
	PermohonanID uuid.UUID `json:"permohonan_id"`
	Pesan        string    `json:"pesan"`
	Dibaca       bool      `json:"dibaca"`
	Tanggal      time.Time `json:"tanggal"`
}

type MarkNotifikasiReadRequest struct {
	NotifikasiIDs []string `json:"notifikasi_ids" binding:"required"`
}

// ============== Admin Management DTOs ==============

type CreateAdminRequest struct {
	Username    string `json:"username" binding:"required,min=3,max=50"`
	Password    string `json:"password" binding:"required,min=6"`
	Email       string `json:"email" binding:"required,email"`
	NamaLengkap string `json:"nama_lengkap" binding:"required"`
	Role        string `json:"role" binding:"required,oneof=super_admin admin"`
}

type UpdateAdminRequest struct {
	Username    string `json:"username" binding:"omitempty,min=3,max=50"`
	Email       string `json:"email" binding:"omitempty,email"`
	NamaLengkap string `json:"nama_lengkap"`
	Role        string `json:"role" binding:"omitempty,oneof=super_admin admin"`
	IsActive    *bool  `json:"is_active"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type ResetPasswordRequest struct {
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type AdminResponse struct {
	ID          uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	NamaLengkap string    `json:"nama_lengkap"`
	Role        string    `json:"role"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type AdminListResponse struct {
	Data       []AdminResponse `json:"data"`
	Total      int64           `json:"total"`
	Page       int             `json:"page"`
	PerPage    int             `json:"per_page"`
	TotalPages int             `json:"total_pages"`
}

// ============== Common DTOs ==============

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type PaginationQuery struct {
	Page    int    `form:"page,default=1"`
	PerPage int    `form:"per_page,default=10"`
	Search  string `form:"search"`
	Status  string `form:"status"`
	SortBy  string `form:"sort_by,default=created_at"`
	SortDir string `form:"sort_dir,default=desc"`
}

func (p *PaginationQuery) GetOffset() int {
	return (p.Page - 1) * p.PerPage
}

func (p *PaginationQuery) GetLimit() int {
	if p.PerPage > 100 {
		return 100
	}
	if p.PerPage < 1 {
		return 10
	}
	return p.PerPage
}
