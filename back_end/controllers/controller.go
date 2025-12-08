package controllers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/alifsyafan/backend-capston/dto"
	"github.com/alifsyafan/backend-capston/models"
	"github.com/alifsyafan/backend-capston/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ============== Auth Controller ==============

type AuthController struct {
	authService services.AuthService
}

func NewAuthController(authService services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

func (c *AuthController) Login(ctx *gin.Context) {
	var req dto.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Data tidak valid",
			Error:   err.Error(),
		})
		return
	}

	response, err := c.authService.Login(req)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Login gagal",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Login berhasil",
		Data:    response,
	})
}

func (c *AuthController) GetProfile(ctx *gin.Context) {
	adminID, exists := ctx.Get("admin_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	admin, err := c.authService.GetAdminByID(adminID.(uuid.UUID))
	if err != nil {
		ctx.JSON(http.StatusNotFound, dto.APIResponse{
			Success: false,
			Message: "Admin tidak ditemukan",
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data: dto.AdminInfo{
			ID:          admin.ID,
			Username:    admin.Username,
			Email:       admin.Email,
			NamaLengkap: admin.NamaLengkap,
		},
	})
}

// ============== Jenis Perizinan Controller ==============

type JenisPerizinanController struct {
	service services.JenisPerizinanService
}

func NewJenisPerizinanController(service services.JenisPerizinanService) *JenisPerizinanController {
	return &JenisPerizinanController{service: service}
}

func (c *JenisPerizinanController) Create(ctx *gin.Context) {
	var req dto.CreateJenisPerizinanRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Data tidak valid",
			Error:   err.Error(),
		})
		return
	}

	jp, err := c.service.Create(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal membuat jenis perizinan",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Success: true,
		Message: "Jenis perizinan berhasil dibuat",
		Data:    jp,
	})
}

func (c *JenisPerizinanController) GetAll(ctx *gin.Context) {
	aktifOnly := ctx.Query("aktif_only") == "true"
	list, err := c.service.GetAll(aktifOnly)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengambil data",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    list,
	})
}

func (c *JenisPerizinanController) GetByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "ID tidak valid",
		})
		return
	}

	jp, err := c.service.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, dto.APIResponse{
			Success: false,
			Message: "Jenis perizinan tidak ditemukan",
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    jp,
	})
}

func (c *JenisPerizinanController) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "ID tidak valid",
		})
		return
	}

	var req dto.UpdateJenisPerizinanRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Data tidak valid",
			Error:   err.Error(),
		})
		return
	}

	jp, err := c.service.Update(id, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal update jenis perizinan",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Jenis perizinan berhasil diupdate",
		Data:    jp,
	})
}

func (c *JenisPerizinanController) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "ID tidak valid",
		})
		return
	}

	err = c.service.Delete(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal menghapus jenis perizinan",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Jenis perizinan berhasil dihapus",
	})
}

// ============== Permohonan Controller ==============

type PermohonanController struct {
	service    services.PermohonanService
	uploadPath string
}

func NewPermohonanController(service services.PermohonanService, uploadPath string) *PermohonanController {
	return &PermohonanController{service: service, uploadPath: uploadPath}
}

func (c *PermohonanController) Create(ctx *gin.Context) {
	// Parse multipart form
	err := ctx.Request.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Gagal parsing form data",
			Error:   err.Error(),
		})
		return
	}

	// Get form data
	var req dto.CreatePermohonanRequest
	req.Pemohon.NamaLengkap = ctx.PostForm("nama_lengkap")
	req.Pemohon.NomorTelepon = ctx.PostForm("nomor_telepon")
	req.Pemohon.Email = ctx.PostForm("email")
	req.Pemohon.Alamat = ctx.PostForm("alamat")
	req.JenisPerizinanID = ctx.PostForm("jenis_perizinan_id")
	req.Catatan = ctx.PostForm("catatan")

	// Validate required fields
	if req.Pemohon.NamaLengkap == "" || req.Pemohon.Email == "" || req.JenisPerizinanID == "" {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Data tidak lengkap",
		})
		return
	}

	// Handle file uploads
	var berkasFiles []models.Berkas
	form, _ := ctx.MultipartForm()
	if form != nil && form.File["berkas"] != nil {
		files := form.File["berkas"]
		for _, file := range files {
			// Generate unique filename
			ext := filepath.Ext(file.Filename)
			newFilename := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().Unix(), ext)
			filePath := filepath.Join(c.uploadPath, newFilename)

			// Ensure upload directory exists
			os.MkdirAll(c.uploadPath, os.ModePerm)

			// Save file
			src, err := file.Open()
			if err != nil {
				continue
			}
			defer src.Close()

			dst, err := os.Create(filePath)
			if err != nil {
				continue
			}
			defer dst.Close()

			io.Copy(dst, src)

			berkasFiles = append(berkasFiles, models.Berkas{
				NamaFile: newFilename,
				NamaAsli: file.Filename,
				Path:     filePath,
				Ukuran:   file.Size,
				MimeType: file.Header.Get("Content-Type"),
			})
		}
	}

	permohonan, err := c.service.Create(req, berkasFiles)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal membuat permohonan",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, dto.APIResponse{
		Success: true,
		Message: "Permohonan berhasil diajukan",
		Data:    permohonan,
	})
}

func (c *PermohonanController) GetAll(ctx *gin.Context) {
	var pagination dto.PaginationQuery
	if err := ctx.ShouldBindQuery(&pagination); err != nil {
		pagination = dto.PaginationQuery{Page: 1, PerPage: 10}
	}

	if pagination.Page < 1 {
		pagination.Page = 1
	}

	response, err := c.service.GetAll(pagination)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengambil data",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    response,
	})
}

func (c *PermohonanController) GetByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "ID tidak valid",
		})
		return
	}

	permohonan, err := c.service.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, dto.APIResponse{
			Success: false,
			Message: "Permohonan tidak ditemukan",
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    permohonan,
	})
}

func (c *PermohonanController) GetByStatus(ctx *gin.Context) {
	status := ctx.Param("status")
	if status == "" {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Status tidak valid",
		})
		return
	}

	list, err := c.service.GetByStatus(status)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengambil data",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    list,
	})
}

func (c *PermohonanController) UpdateStatus(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "ID tidak valid",
		})
		return
	}

	adminID, exists := ctx.Get("admin_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	var req dto.UpdatePermohonanStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Data tidak valid",
			Error:   err.Error(),
		})
		return
	}

	err = c.service.UpdateStatus(id, adminID.(uuid.UUID), req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal update status",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Status berhasil diupdate",
	})
}

func (c *PermohonanController) KirimBalasan(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "ID tidak valid",
		})
		return
	}

	adminID, exists := ctx.Get("admin_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	var req dto.KirimBalasanRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Data tidak valid",
			Error:   err.Error(),
		})
		return
	}

	err = c.service.KirimBalasan(id, adminID.(uuid.UUID), req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengirim balasan",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Balasan berhasil dikirim ke email pemohon",
	})
}

func (c *PermohonanController) GetStatistik(ctx *gin.Context) {
	statistik, err := c.service.GetStatistik()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengambil statistik",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    statistik,
	})
}

func (c *PermohonanController) GetRecentPermohonan(ctx *gin.Context) {
	list, err := c.service.GetRecentPermohonan(5)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengambil data",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    list,
	})
}

func (c *PermohonanController) DownloadFile(ctx *gin.Context) {
	filename := ctx.Param("filename")
	originalName := ctx.Query("name")

	if filename == "" {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "Filename tidak valid",
		})
		return
	}

	filePath := filepath.Join(c.uploadPath, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		ctx.JSON(http.StatusNotFound, dto.APIResponse{
			Success: false,
			Message: "File tidak ditemukan",
		})
		return
	}

	// Set download name
	downloadName := filename
	if originalName != "" {
		downloadName = originalName
	}

	// Set headers for download
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", downloadName))
	ctx.Header("Content-Type", "application/octet-stream")

	ctx.File(filePath)
}

// ============== Notifikasi Controller ==============

type NotifikasiController struct {
	service services.NotifikasiService
}

func NewNotifikasiController(service services.NotifikasiService) *NotifikasiController {
	return &NotifikasiController{service: service}
}

func (c *NotifikasiController) GetAll(ctx *gin.Context) {
	adminID, exists := ctx.Get("admin_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	unreadOnly := ctx.Query("unread_only") == "true"
	list, err := c.service.GetByAdminID(adminID.(uuid.UUID), unreadOnly)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengambil notifikasi",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    list,
	})
}

func (c *NotifikasiController) MarkAsRead(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dto.APIResponse{
			Success: false,
			Message: "ID tidak valid",
		})
		return
	}

	err = c.service.MarkAsRead(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal update notifikasi",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Notifikasi ditandai sudah dibaca",
	})
}

func (c *NotifikasiController) MarkAllAsRead(ctx *gin.Context) {
	adminID, exists := ctx.Get("admin_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	err := c.service.MarkAllAsRead(adminID.(uuid.UUID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal update notifikasi",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Message: "Semua notifikasi ditandai sudah dibaca",
	})
}

func (c *NotifikasiController) CountUnread(ctx *gin.Context) {
	adminID, exists := ctx.Get("admin_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, dto.APIResponse{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	count, err := c.service.CountUnread(adminID.(uuid.UUID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dto.APIResponse{
			Success: false,
			Message: "Gagal mengambil jumlah notifikasi",
			Error:   err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dto.APIResponse{
		Success: true,
		Data:    map[string]int64{"count": count},
	})
}
