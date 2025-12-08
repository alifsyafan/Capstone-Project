package services

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/alifsyafan/backend-capston/config"
	"github.com/alifsyafan/backend-capston/dto"
	"github.com/alifsyafan/backend-capston/models"
	"github.com/alifsyafan/backend-capston/repositories"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

// ============== Auth Service ==============

type AuthService interface {
	Login(req dto.LoginRequest) (*dto.LoginResponse, error)
	ValidateToken(tokenString string) (*jwt.MapClaims, error)
	GetAdminByID(id uuid.UUID) (*models.Admin, error)
}

type authService struct {
	adminRepo repositories.AdminRepository
	cfg       *config.Config
}

func NewAuthService(adminRepo repositories.AdminRepository, cfg *config.Config) AuthService {
	return &authService{adminRepo: adminRepo, cfg: cfg}
}

func (s *authService) Login(req dto.LoginRequest) (*dto.LoginResponse, error) {
	admin, err := s.adminRepo.FindByUsername(req.Username)
	if err != nil {
		return nil, errors.New("username atau password salah")
	}

	if !admin.IsActive {
		return nil, errors.New("akun tidak aktif")
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("username atau password salah")
	}

	// Generate JWT token
	expiryHours, _ := strconv.Atoi(s.cfg.JWTExpiryHours)
	expiresAt := time.Now().Add(time.Duration(expiryHours) * time.Hour)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"admin_id": admin.ID.String(),
		"username": admin.Username,
		"exp":      expiresAt.Unix(),
	})

	tokenString, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return nil, errors.New("gagal membuat token")
	}

	return &dto.LoginResponse{
		Token:     tokenString,
		ExpiresAt: expiresAt,
		Admin: dto.AdminInfo{
			ID:          admin.ID,
			Username:    admin.Username,
			Email:       admin.Email,
			NamaLengkap: admin.NamaLengkap,
		},
	}, nil
}

func (s *authService) ValidateToken(tokenString string) (*jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.cfg.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return &claims, nil
	}

	return nil, errors.New("invalid token")
}

func (s *authService) GetAdminByID(id uuid.UUID) (*models.Admin, error) {
	return s.adminRepo.FindByID(id)
}

// ============== Jenis Perizinan Service ==============

type JenisPerizinanService interface {
	Create(req dto.CreateJenisPerizinanRequest) (*models.JenisPerizinan, error)
	GetAll(aktifOnly bool) ([]dto.JenisPerizinanResponse, error)
	GetByID(id uuid.UUID) (*dto.JenisPerizinanResponse, error)
	Update(id uuid.UUID, req dto.UpdateJenisPerizinanRequest) (*models.JenisPerizinan, error)
	Delete(id uuid.UUID) error
}

type jenisPerizinanService struct {
	repo repositories.JenisPerizinanRepository
}

func NewJenisPerizinanService(repo repositories.JenisPerizinanRepository) JenisPerizinanService {
	return &jenisPerizinanService{repo: repo}
}

func (s *jenisPerizinanService) Create(req dto.CreateJenisPerizinanRequest) (*models.JenisPerizinan, error) {
	jp := &models.JenisPerizinan{
		Nama:        req.Nama,
		Deskripsi:   req.Deskripsi,
		Persyaratan: req.Persyaratan,
		Aktif:       req.Aktif,
	}
	err := s.repo.Create(jp)
	return jp, err
}

func (s *jenisPerizinanService) GetAll(aktifOnly bool) ([]dto.JenisPerizinanResponse, error) {
	list, err := s.repo.FindAll(aktifOnly)
	if err != nil {
		return nil, err
	}

	var response []dto.JenisPerizinanResponse
	for _, jp := range list {
		response = append(response, dto.JenisPerizinanResponse{
			ID:          jp.ID,
			Nama:        jp.Nama,
			Deskripsi:   jp.Deskripsi,
			Persyaratan: jp.Persyaratan,
			Aktif:       jp.Aktif,
			CreatedAt:   jp.CreatedAt,
		})
	}
	return response, nil
}

func (s *jenisPerizinanService) GetByID(id uuid.UUID) (*dto.JenisPerizinanResponse, error) {
	jp, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return &dto.JenisPerizinanResponse{
		ID:          jp.ID,
		Nama:        jp.Nama,
		Deskripsi:   jp.Deskripsi,
		Persyaratan: jp.Persyaratan,
		Aktif:       jp.Aktif,
		CreatedAt:   jp.CreatedAt,
	}, nil
}

func (s *jenisPerizinanService) Update(id uuid.UUID, req dto.UpdateJenisPerizinanRequest) (*models.JenisPerizinan, error) {
	jp, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if req.Nama != "" {
		jp.Nama = req.Nama
	}
	if req.Deskripsi != "" {
		jp.Deskripsi = req.Deskripsi
	}
	if req.Persyaratan != nil {
		jp.Persyaratan = req.Persyaratan
	}
	if req.Aktif != nil {
		jp.Aktif = *req.Aktif
	}

	err = s.repo.Update(jp)
	return jp, err
}

func (s *jenisPerizinanService) Delete(id uuid.UUID) error {
	return s.repo.Delete(id)
}

// ============== Permohonan Service ==============

type PermohonanService interface {
	Create(req dto.CreatePermohonanRequest, berkasFiles []models.Berkas) (*models.Permohonan, error)
	GetAll(pagination dto.PaginationQuery) (*dto.PermohonanListResponse, error)
	GetByID(id uuid.UUID) (*dto.PermohonanResponse, error)
	GetByStatus(status string) ([]dto.PermohonanResponse, error)
	UpdateStatus(id uuid.UUID, adminID uuid.UUID, req dto.UpdatePermohonanStatusRequest) error
	KirimBalasan(id uuid.UUID, adminID uuid.UUID, req dto.KirimBalasanRequest) error
	GetStatistik() (*dto.StatistikDashboard, error)
	GetRecentPermohonan(limit int) ([]dto.PermohonanResponse, error)
}

type permohonanService struct {
	permohonanRepo repositories.PermohonanRepository
	pemohonRepo    repositories.PemohonRepository
	jpRepo         repositories.JenisPerizinanRepository
	notifRepo      repositories.NotifikasiRepository
	adminRepo      repositories.AdminRepository
	emailService   EmailService
}

func NewPermohonanService(
	permohonanRepo repositories.PermohonanRepository,
	pemohonRepo repositories.PemohonRepository,
	jpRepo repositories.JenisPerizinanRepository,
	notifRepo repositories.NotifikasiRepository,
	adminRepo repositories.AdminRepository,
	emailService EmailService,
) PermohonanService {
	return &permohonanService{
		permohonanRepo: permohonanRepo,
		pemohonRepo:    pemohonRepo,
		jpRepo:         jpRepo,
		notifRepo:      notifRepo,
		adminRepo:      adminRepo,
		emailService:   emailService,
	}
}

func (s *permohonanService) Create(req dto.CreatePermohonanRequest, berkasFiles []models.Berkas) (*models.Permohonan, error) {
	// Create or find pemohon
	pemohon := &models.Pemohon{
		NamaLengkap:  req.Pemohon.NamaLengkap,
		NomorTelepon: req.Pemohon.NomorTelepon,
		Email:        req.Pemohon.Email,
		Alamat:       req.Pemohon.Alamat,
	}
	err := s.pemohonRepo.Create(pemohon)
	if err != nil {
		return nil, fmt.Errorf("gagal menyimpan data pemohon: %w", err)
	}

	// Parse jenis perizinan ID
	jpID, err := uuid.Parse(req.JenisPerizinanID)
	if err != nil {
		return nil, fmt.Errorf("jenis perizinan ID tidak valid: %w", err)
	}

	// Verify jenis perizinan exists
	_, err = s.jpRepo.FindByID(jpID)
	if err != nil {
		return nil, fmt.Errorf("jenis perizinan tidak ditemukan: %w", err)
	}

	// Create permohonan
	permohonan := &models.Permohonan{
		PemohonID:        pemohon.ID,
		JenisPerizinanID: jpID,
		Catatan:          req.Catatan,
		Status:           models.StatusBaru,
		TanggalMasuk:     time.Now(),
		Berkas:           berkasFiles,
	}

	err = s.permohonanRepo.Create(permohonan)
	if err != nil {
		return nil, fmt.Errorf("gagal menyimpan permohonan: %w", err)
	}

	// Create notification for all admins
	go s.createNotificationForAllAdmins(permohonan, pemohon)

	return permohonan, nil
}

func (s *permohonanService) createNotificationForAllAdmins(permohonan *models.Permohonan, pemohon *models.Pemohon) {
	// Get jenis perizinan name
	jp, _ := s.jpRepo.FindByID(permohonan.JenisPerizinanID)
	jpNama := ""
	if jp != nil {
		jpNama = jp.Nama
	}

	// For now, we'll create notification for the first admin
	// In production, you'd want to get all admins and create notifications for each
	admin, _ := s.adminRepo.FindByUsername("admin")
	if admin != nil {
		notif := &models.Notifikasi{
			AdminID:      admin.ID,
			PermohonanID: permohonan.ID,
			Pesan:        fmt.Sprintf("Permohonan baru dari %s - %s", pemohon.NamaLengkap, jpNama),
			Dibaca:       false,
			Tanggal:      time.Now(),
		}
		s.notifRepo.Create(notif)
	}
}

func (s *permohonanService) GetAll(pagination dto.PaginationQuery) (*dto.PermohonanListResponse, error) {
	list, total, err := s.permohonanRepo.FindAll(pagination.Page, pagination.GetLimit(), pagination.Status, pagination.Search)
	if err != nil {
		return nil, err
	}

	var responses []dto.PermohonanResponse
	for _, p := range list {
		responses = append(responses, s.mapPermohonanToResponse(p))
	}

	totalPages := int(total) / pagination.GetLimit()
	if int(total)%pagination.GetLimit() > 0 {
		totalPages++
	}

	return &dto.PermohonanListResponse{
		Data:       responses,
		Total:      total,
		Page:       pagination.Page,
		PerPage:    pagination.GetLimit(),
		TotalPages: totalPages,
	}, nil
}

func (s *permohonanService) GetByID(id uuid.UUID) (*dto.PermohonanResponse, error) {
	p, err := s.permohonanRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	response := s.mapPermohonanToResponse(*p)
	return &response, nil
}

func (s *permohonanService) GetByStatus(status string) ([]dto.PermohonanResponse, error) {
	list, err := s.permohonanRepo.FindByStatus(models.StatusPermohonan(status))
	if err != nil {
		return nil, err
	}

	var responses []dto.PermohonanResponse
	for _, p := range list {
		responses = append(responses, s.mapPermohonanToResponse(p))
	}
	return responses, nil
}

func (s *permohonanService) UpdateStatus(id uuid.UUID, adminID uuid.UUID, req dto.UpdatePermohonanStatusRequest) error {
	p, err := s.permohonanRepo.FindByID(id)
	if err != nil {
		return err
	}

	p.Status = models.StatusPermohonan(req.Status)
	p.CatatanAdmin = req.CatatanAdmin
	p.DikelolaOleh = &adminID

	now := time.Now()
	if req.Status == "diproses" {
		p.TanggalDiproses = &now
	} else if req.Status == "disetujui" || req.Status == "ditolak" {
		p.TanggalSelesai = &now
	}

	return s.permohonanRepo.Update(p)
}

func (s *permohonanService) KirimBalasan(id uuid.UUID, adminID uuid.UUID, req dto.KirimBalasanRequest) error {
	p, err := s.permohonanRepo.FindByID(id)
	if err != nil {
		return err
	}

	// Update permohonan status
	p.Status = models.StatusPermohonan(req.Status)
	p.BalasanEmail = req.BalasanEmail
	p.DikelolaOleh = &adminID
	now := time.Now()
	p.TanggalSelesai = &now

	err = s.permohonanRepo.Update(p)
	if err != nil {
		return err
	}

	// Send email
	go s.emailService.SendBalasanEmail(p.Pemohon.Email, p.Pemohon.NamaLengkap, p.JenisPerizinan.Nama, req.BalasanEmail, req.Status, p.ID)

	return nil
}

func (s *permohonanService) GetStatistik() (*dto.StatistikDashboard, error) {
	counts, err := s.permohonanRepo.CountByStatus()
	if err != nil {
		return nil, err
	}

	return &dto.StatistikDashboard{
		TotalPermohonan:     counts["total"],
		PermohonanBaru:      counts["baru"],
		PermohonanDiproses:  counts["diproses"],
		PermohonanSelesai:   counts["selesai"],
		PermohonanDisetujui: counts["disetujui"],
		PermohonanDitolak:   counts["ditolak"],
	}, nil
}

func (s *permohonanService) GetRecentPermohonan(limit int) ([]dto.PermohonanResponse, error) {
	list, err := s.permohonanRepo.GetRecentPermohonan(limit)
	if err != nil {
		return nil, err
	}

	var responses []dto.PermohonanResponse
	for _, p := range list {
		responses = append(responses, s.mapPermohonanToResponse(p))
	}
	return responses, nil
}

func (s *permohonanService) mapPermohonanToResponse(p models.Permohonan) dto.PermohonanResponse {
	var berkasResponses []dto.BerkasResponse
	for _, b := range p.Berkas {
		berkasResponses = append(berkasResponses, dto.BerkasResponse{
			ID:        b.ID,
			NamaFile:  b.NamaFile,
			NamaAsli:  b.NamaAsli,
			Path:      b.Path,
			Ukuran:    b.Ukuran,
			MimeType:  b.MimeType,
			CreatedAt: b.CreatedAt,
		})
	}

	return dto.PermohonanResponse{
		ID: p.ID,
		Pemohon: dto.PemohonResponse{
			ID:           p.Pemohon.ID,
			NamaLengkap:  p.Pemohon.NamaLengkap,
			NomorTelepon: p.Pemohon.NomorTelepon,
			Email:        p.Pemohon.Email,
			Alamat:       p.Pemohon.Alamat,
		},
		JenisPerizinan: dto.JenisPerizinanResponse{
			ID:          p.JenisPerizinan.ID,
			Nama:        p.JenisPerizinan.Nama,
			Deskripsi:   p.JenisPerizinan.Deskripsi,
			Persyaratan: p.JenisPerizinan.Persyaratan,
			Aktif:       p.JenisPerizinan.Aktif,
			CreatedAt:   p.JenisPerizinan.CreatedAt,
		},
		Berkas:          berkasResponses,
		Catatan:         p.Catatan,
		Status:          string(p.Status),
		TanggalMasuk:    p.TanggalMasuk,
		TanggalDiproses: p.TanggalDiproses,
		TanggalSelesai:  p.TanggalSelesai,
		BalasanEmail:    p.BalasanEmail,
		CatatanAdmin:    p.CatatanAdmin,
		CreatedAt:       p.CreatedAt,
	}
}

// ============== Notifikasi Service ==============

type NotifikasiService interface {
	GetByAdminID(adminID uuid.UUID, unreadOnly bool) ([]dto.NotifikasiResponse, error)
	MarkAsRead(id uuid.UUID) error
	MarkAllAsRead(adminID uuid.UUID) error
	CountUnread(adminID uuid.UUID) (int64, error)
}

type notifikasiService struct {
	repo repositories.NotifikasiRepository
}

func NewNotifikasiService(repo repositories.NotifikasiRepository) NotifikasiService {
	return &notifikasiService{repo: repo}
}

func (s *notifikasiService) GetByAdminID(adminID uuid.UUID, unreadOnly bool) ([]dto.NotifikasiResponse, error) {
	list, err := s.repo.FindByAdminID(adminID, unreadOnly)
	if err != nil {
		return nil, err
	}

	var responses []dto.NotifikasiResponse
	for _, n := range list {
		responses = append(responses, dto.NotifikasiResponse{
			ID:           n.ID,
			PermohonanID: n.PermohonanID,
			Pesan:        n.Pesan,
			Dibaca:       n.Dibaca,
			Tanggal:      n.Tanggal,
		})
	}
	return responses, nil
}

func (s *notifikasiService) MarkAsRead(id uuid.UUID) error {
	return s.repo.MarkAsRead(id)
}

func (s *notifikasiService) MarkAllAsRead(adminID uuid.UUID) error {
	return s.repo.MarkAllAsRead(adminID)
}

func (s *notifikasiService) CountUnread(adminID uuid.UUID) (int64, error) {
	return s.repo.CountUnread(adminID)
}

// ============== Email Service ==============

type EmailService interface {
	SendBalasanEmail(toEmail, namaPemohon, jenisPerizinan, balasan, status string, permohonanID uuid.UUID) error
}

type emailService struct {
	cfg          *config.Config
	emailLogRepo repositories.EmailLogRepository
}

func NewEmailService(cfg *config.Config, emailLogRepo repositories.EmailLogRepository) EmailService {
	return &emailService{cfg: cfg, emailLogRepo: emailLogRepo}
}

func (s *emailService) SendBalasanEmail(toEmail, namaPemohon, jenisPerizinan, balasan, status string, permohonanID uuid.UUID) error {
	statusText := "Disetujui"
	if status == "ditolak" {
		statusText = "Ditolak"
	}

	subject := fmt.Sprintf("Balasan Permohonan %s - %s", jenisPerizinan, statusText)

	body := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; line-height: 1.6;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
					<h1>Dinas Kesehatan Kota Makassar</h1>
				</div>
				<div style="padding: 20px; background-color: #f8fafc;">
					<h2>Yth. %s,</h2>
					<p>Berikut adalah balasan untuk permohonan <strong>%s</strong> Anda:</p>
					<div style="background-color: white; border-left: 4px solid %s; padding: 15px; margin: 20px 0;">
						<p><strong>Status: %s</strong></p>
						<p>%s</p>
					</div>
					<p>Jika ada pertanyaan lebih lanjut, silakan hubungi kami.</p>
					<hr style="margin: 20px 0;">
					<p style="color: #666; font-size: 12px;">
						Email ini dikirim secara otomatis dari sistem perizinan Dinas Kesehatan Kota Makassar.
					</p>
				</div>
			</div>
		</body>
		</html>
	`, namaPemohon, jenisPerizinan, getStatusColor(status), statusText, balasan)

	// Create email log entry
	emailLog := &models.EmailLog{
		PermohonanID: permohonanID,
		EmailTujuan:  toEmail,
		Subjek:       subject,
		Isi:          balasan,
		Status:       "pending",
	}

	// Send email via SMTP
	port, _ := strconv.Atoi(s.cfg.SMTPPort)
	m := gomail.NewMessage()
	m.SetHeader("From", s.cfg.SMTPFrom)
	m.SetHeader("To", toEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(s.cfg.SMTPHost, port, s.cfg.SMTPUsername, s.cfg.SMTPPassword)

	err := d.DialAndSend(m)
	now := time.Now()
	if err != nil {
		emailLog.Status = "failed"
		emailLog.Error = err.Error()
		s.emailLogRepo.Create(emailLog)
		return err
	}

	emailLog.Status = "sent"
	emailLog.SentAt = &now
	s.emailLogRepo.Create(emailLog)

	return nil
}

func getStatusColor(status string) string {
	if status == "disetujui" {
		return "#10b981"
	}
	return "#ef4444"
}
