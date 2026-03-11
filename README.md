# Pengajuan Perizinan - Dinas Kesehatan Kota Makassar

Website Pengajuan Perizinan di Pengembangan Sumber Daya Kesehatan Dinas Kesehatan Kota Makassar

## 📋 Deskripsi

Website ini dibuat untuk membantu Dinas Kesehatan Kota Makassar dalam mengelola proses pengajuan perizinan di bidang Pengembangan Sumber Daya Kesehatan dengan lebih teratur dan efisien. Melalui sistem ini, masyarakat dapat mengajukan permohonan izin secara online tanpa perlu datang langsung ke kantor dinas.

Bagi petugas admin, sistem ini menyediakan fitur untuk memverifikasi, memproses, dan mendokumentasikan setiap permohonan perizinan secara rapi dan terstruktur. Fitur dashboard memungkinkan petugas memantau jumlah permohonan baru, yang sedang diproses, serta riwayat permohonan yang telah selesai.

## ✨ Fitur Utama

### Untuk Masyarakat (Public)
- 📝 Pengajuan permohonan izin online (Izin Kunjungan, PKL/Magang, Penelitian)
- 🔍 Cek status permohonan dengan nomor registrasi
- 📧 Notifikasi email untuk update status permohonan
- 📱 Tampilan responsif (Desktop & Mobile)

### Untuk Admin
- 📊 Dashboard statistik permohonan
- 📋 Manajemen permohonan (verifikasi, proses, setujui/tolak)
- ⚙️ Kelola jenis perizinan
- 👥 Kelola admin (khusus Super Admin)
- 🔔 Sistem notifikasi real-time
- 📧 Kirim balasan/email ke pemohon

## 🛠️ Tech Stack

### Backend
- **Bahasa:** Go (Golang)
- **Framework:** Gin
- **ORM:** GORM
- **Database:** MySQL
- **Authentication:** JWT
- **Email:** SMTP (Gomail)

### Frontend
- **Framework:** Next.js 14
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API

## 📁 Struktur Proyek

```
Capstone-Project/
├── back_end/
│   ├── config/          # Konfigurasi database
│   ├── controllers/     # Handler HTTP
│   ├── dto/             # Data Transfer Objects
│   ├── middleware/      # Auth & Role middleware
│   ├── models/          # Model database
│   ├── repositories/    # Data access layer
│   ├── routes/          # Definisi routing
│   ├── services/        # Business logic
│   ├── uploads/         # File uploads
│   ├── main.go          # Entry point
│   └── go.mod           # Go dependencies
│
└── front_end/
    ├── public/          # Static assets
    ├── src/
    │   ├── app/         # Next.js pages
    │   │   ├── admin/   # Admin panel
    │   │   └── page.tsx # Landing page
    │   ├── components/  # React components
    │   ├── lib/         # API functions
    │   └── types/       # TypeScript types
    ├── package.json     # Node dependencies
    └── tailwind.config.ts
```

## 🚀 Cara Menjalankan

### Prasyarat
- Go 1.21+
- Node.js 18+
- MySQL 8.0+
- npm atau yarn

### 1. Clone Repository
```bash
git clone https://github.com/alifsyafan/Capstone-Project.git
cd Capstone-Project
```

### 2. Setup Backend
```bash
cd back_end

# Buat file .env
cp .env.example .env

# Edit .env sesuai konfigurasi database Anda
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=perizinan_db

# Jalankan backend
go run main.go
```

Backend akan berjalan di `http://localhost:8080`

### 3. Setup Frontend
```bash
cd front_end

# Install dependencies
npm install

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🔐 Akses Admin

Setelah pertama kali menjalankan aplikasi, sistem akan otomatis membuat akun Super Admin default:

- **Username:** admin
- **Password:** admin123

> ⚠️ **Penting:** Segera ubah password setelah login pertama kali!

## 👥 Tim Pengembang

| No | Nama | NIM | Role |
|----|------|-----|------|
| 1 | Muhammad Alif Syafan | 105841114422 | Backend Development |
| 2 | Ahmad Fathir | 105841105922 | Frontend Development |
| 3 | Syahrul Ramadhan | 105841113722 | UI/UX Design |
| 4 | Muhammad Aditya Yudistira | 105841114122 | UI/UX Design |

## 📄 Lisensi

Proyek ini dibuat untuk keperluan Capstone Project.

---

© 2024 Dinas Kesehatan Kota Makassar