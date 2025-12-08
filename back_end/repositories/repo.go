package repositories

import (
	"github.com/alifsyafan/backend-capston/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ============== Admin Repository ==============

type AdminRepository interface {
	Create(admin *models.Admin) error
	FindByID(id uuid.UUID) (*models.Admin, error)
	FindByUsername(username string) (*models.Admin, error)
	FindByEmail(email string) (*models.Admin, error)
	Update(admin *models.Admin) error
	Delete(id uuid.UUID) error
}

type adminRepository struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) AdminRepository {
	return &adminRepository{db: db}
}

func (r *adminRepository) Create(admin *models.Admin) error {
	return r.db.Create(admin).Error
}

func (r *adminRepository) FindByID(id uuid.UUID) (*models.Admin, error) {
	var admin models.Admin
	err := r.db.Where("id = ?", id).First(&admin).Error
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *adminRepository) FindByUsername(username string) (*models.Admin, error) {
	var admin models.Admin
	err := r.db.Where("username = ?", username).First(&admin).Error
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *adminRepository) FindByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	err := r.db.Where("email = ?", email).First(&admin).Error
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *adminRepository) Update(admin *models.Admin) error {
	return r.db.Save(admin).Error
}

func (r *adminRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Admin{}, id).Error
}

// ============== Jenis Perizinan Repository ==============

type JenisPerizinanRepository interface {
	Create(jp *models.JenisPerizinan) error
	FindAll(aktifOnly bool) ([]models.JenisPerizinan, error)
	FindByID(id uuid.UUID) (*models.JenisPerizinan, error)
	Update(jp *models.JenisPerizinan) error
	Delete(id uuid.UUID) error
}

type jenisPerizinanRepository struct {
	db *gorm.DB
}

func NewJenisPerizinanRepository(db *gorm.DB) JenisPerizinanRepository {
	return &jenisPerizinanRepository{db: db}
}

func (r *jenisPerizinanRepository) Create(jp *models.JenisPerizinan) error {
	return r.db.Create(jp).Error
}

func (r *jenisPerizinanRepository) FindAll(aktifOnly bool) ([]models.JenisPerizinan, error) {
	var list []models.JenisPerizinan
	query := r.db
	if aktifOnly {
		query = query.Where("aktif = ?", true)
	}
	err := query.Order("created_at DESC").Find(&list).Error
	return list, err
}

func (r *jenisPerizinanRepository) FindByID(id uuid.UUID) (*models.JenisPerizinan, error) {
	var jp models.JenisPerizinan
	err := r.db.Where("id = ?", id).First(&jp).Error
	if err != nil {
		return nil, err
	}
	return &jp, nil
}

func (r *jenisPerizinanRepository) Update(jp *models.JenisPerizinan) error {
	return r.db.Save(jp).Error
}

func (r *jenisPerizinanRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.JenisPerizinan{}, id).Error
}

// ============== Pemohon Repository ==============

type PemohonRepository interface {
	Create(pemohon *models.Pemohon) error
	FindByID(id uuid.UUID) (*models.Pemohon, error)
	FindByEmail(email string) (*models.Pemohon, error)
	Update(pemohon *models.Pemohon) error
}

type pemohonRepository struct {
	db *gorm.DB
}

func NewPemohonRepository(db *gorm.DB) PemohonRepository {
	return &pemohonRepository{db: db}
}

func (r *pemohonRepository) Create(pemohon *models.Pemohon) error {
	return r.db.Create(pemohon).Error
}

func (r *pemohonRepository) FindByID(id uuid.UUID) (*models.Pemohon, error) {
	var pemohon models.Pemohon
	err := r.db.Where("id = ?", id).First(&pemohon).Error
	if err != nil {
		return nil, err
	}
	return &pemohon, nil
}

func (r *pemohonRepository) FindByEmail(email string) (*models.Pemohon, error) {
	var pemohon models.Pemohon
	err := r.db.Where("email = ?", email).First(&pemohon).Error
	if err != nil {
		return nil, err
	}
	return &pemohon, nil
}

func (r *pemohonRepository) Update(pemohon *models.Pemohon) error {
	return r.db.Save(pemohon).Error
}

// ============== Permohonan Repository ==============

type PermohonanRepository interface {
	Create(permohonan *models.Permohonan) error
	FindAll(page, perPage int, status string, search string) ([]models.Permohonan, int64, error)
	FindByID(id uuid.UUID) (*models.Permohonan, error)
	FindByStatus(status models.StatusPermohonan) ([]models.Permohonan, error)
	Update(permohonan *models.Permohonan) error
	Delete(id uuid.UUID) error
	CountByStatus() (map[string]int64, error)
	GetRecentPermohonan(limit int) ([]models.Permohonan, error)
}

type permohonanRepository struct {
	db *gorm.DB
}

func NewPermohonanRepository(db *gorm.DB) PermohonanRepository {
	return &permohonanRepository{db: db}
}

func (r *permohonanRepository) Create(permohonan *models.Permohonan) error {
	return r.db.Create(permohonan).Error
}

func (r *permohonanRepository) FindAll(page, perPage int, status string, search string) ([]models.Permohonan, int64, error) {
	var list []models.Permohonan
	var total int64

	query := r.db.Model(&models.Permohonan{})

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if search != "" {
		query = query.Joins("JOIN pemohons ON pemohons.id = permohonans.pemohon_id").
			Where("pemohons.nama_lengkap ILIKE ? OR pemohons.email ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * perPage
	err = r.db.Preload("Pemohon").Preload("JenisPerizinan").Preload("Berkas").
		Order("tanggal_masuk DESC").
		Offset(offset).Limit(perPage).Find(&list).Error

	return list, total, err
}

func (r *permohonanRepository) FindByID(id uuid.UUID) (*models.Permohonan, error) {
	var permohonan models.Permohonan
	err := r.db.Preload("Pemohon").Preload("JenisPerizinan").Preload("Berkas").Preload("Admin").
		Where("id = ?", id).First(&permohonan).Error
	if err != nil {
		return nil, err
	}
	return &permohonan, nil
}

func (r *permohonanRepository) FindByStatus(status models.StatusPermohonan) ([]models.Permohonan, error) {
	var list []models.Permohonan
	err := r.db.Preload("Pemohon").Preload("JenisPerizinan").Preload("Berkas").
		Where("status = ?", status).Order("tanggal_masuk DESC").Find(&list).Error
	return list, err
}

func (r *permohonanRepository) Update(permohonan *models.Permohonan) error {
	return r.db.Save(permohonan).Error
}

func (r *permohonanRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Permohonan{}, id).Error
}

func (r *permohonanRepository) CountByStatus() (map[string]int64, error) {
	result := make(map[string]int64)

	var total int64
	r.db.Model(&models.Permohonan{}).Count(&total)
	result["total"] = total

	var baru int64
	r.db.Model(&models.Permohonan{}).Where("status = ?", models.StatusBaru).Count(&baru)
	result["baru"] = baru

	var diproses int64
	r.db.Model(&models.Permohonan{}).Where("status = ?", models.StatusDiproses).Count(&diproses)
	result["diproses"] = diproses

	var disetujui int64
	r.db.Model(&models.Permohonan{}).Where("status = ?", models.StatusDisetujui).Count(&disetujui)
	result["disetujui"] = disetujui

	var ditolak int64
	r.db.Model(&models.Permohonan{}).Where("status = ?", models.StatusDitolak).Count(&ditolak)
	result["ditolak"] = ditolak

	result["selesai"] = disetujui + ditolak

	return result, nil
}

func (r *permohonanRepository) GetRecentPermohonan(limit int) ([]models.Permohonan, error) {
	var list []models.Permohonan
	err := r.db.Preload("Pemohon").Preload("JenisPerizinan").
		Order("tanggal_masuk DESC").Limit(limit).Find(&list).Error
	return list, err
}

// ============== Berkas Repository ==============

type BerkasRepository interface {
	Create(berkas *models.Berkas) error
	FindByPermohonanID(permohonanID uuid.UUID) ([]models.Berkas, error)
	Delete(id uuid.UUID) error
}

type berkasRepository struct {
	db *gorm.DB
}

func NewBerkasRepository(db *gorm.DB) BerkasRepository {
	return &berkasRepository{db: db}
}

func (r *berkasRepository) Create(berkas *models.Berkas) error {
	return r.db.Create(berkas).Error
}

func (r *berkasRepository) FindByPermohonanID(permohonanID uuid.UUID) ([]models.Berkas, error) {
	var list []models.Berkas
	err := r.db.Where("permohonan_id = ?", permohonanID).Find(&list).Error
	return list, err
}

func (r *berkasRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Berkas{}, id).Error
}

// ============== Notifikasi Repository ==============

type NotifikasiRepository interface {
	Create(notif *models.Notifikasi) error
	FindByAdminID(adminID uuid.UUID, unreadOnly bool) ([]models.Notifikasi, error)
	FindByID(id uuid.UUID) (*models.Notifikasi, error)
	MarkAsRead(id uuid.UUID) error
	MarkAllAsRead(adminID uuid.UUID) error
	CountUnread(adminID uuid.UUID) (int64, error)
}

type notifikasiRepository struct {
	db *gorm.DB
}

func NewNotifikasiRepository(db *gorm.DB) NotifikasiRepository {
	return &notifikasiRepository{db: db}
}

func (r *notifikasiRepository) Create(notif *models.Notifikasi) error {
	return r.db.Create(notif).Error
}

func (r *notifikasiRepository) FindByAdminID(adminID uuid.UUID, unreadOnly bool) ([]models.Notifikasi, error) {
	var list []models.Notifikasi
	query := r.db.Where("admin_id = ?", adminID)
	if unreadOnly {
		query = query.Where("dibaca = ?", false)
	}
	err := query.Order("tanggal DESC").Limit(50).Find(&list).Error
	return list, err
}

func (r *notifikasiRepository) FindByID(id uuid.UUID) (*models.Notifikasi, error) {
	var notif models.Notifikasi
	err := r.db.Where("id = ?", id).First(&notif).Error
	if err != nil {
		return nil, err
	}
	return &notif, nil
}

func (r *notifikasiRepository) MarkAsRead(id uuid.UUID) error {
	return r.db.Model(&models.Notifikasi{}).Where("id = ?", id).Update("dibaca", true).Error
}

func (r *notifikasiRepository) MarkAllAsRead(adminID uuid.UUID) error {
	return r.db.Model(&models.Notifikasi{}).Where("admin_id = ? AND dibaca = ?", adminID, false).Update("dibaca", true).Error
}

func (r *notifikasiRepository) CountUnread(adminID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&models.Notifikasi{}).Where("admin_id = ? AND dibaca = ?", adminID, false).Count(&count).Error
	return count, err
}

// ============== Email Log Repository ==============

type EmailLogRepository interface {
	Create(log *models.EmailLog) error
	FindByPermohonanID(permohonanID uuid.UUID) ([]models.EmailLog, error)
}

type emailLogRepository struct {
	db *gorm.DB
}

func NewEmailLogRepository(db *gorm.DB) EmailLogRepository {
	return &emailLogRepository{db: db}
}

func (r *emailLogRepository) Create(log *models.EmailLog) error {
	return r.db.Create(log).Error
}

func (r *emailLogRepository) FindByPermohonanID(permohonanID uuid.UUID) ([]models.EmailLog, error) {
	var list []models.EmailLog
	err := r.db.Where("permohonan_id = ?", permohonanID).Order("created_at DESC").Find(&list).Error
	return list, err
}
