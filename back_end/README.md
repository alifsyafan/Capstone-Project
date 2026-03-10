# Backend - Sistem Pengajuan Perizinan Dinas Kesehatan

Backend ini adalah REST API untuk melayani proses pengajuan perizinan, autentikasi admin, manajemen permohonan, notifikasi, dan pengelolaan jenis perizinan.

## Deskripsi Singkat

API backend dibangun dengan Go menggunakan arsitektur berlapis:

- `controllers`: menangani request/response HTTP
- `services`: berisi business logic
- `repositories`: akses data ke database
- `models`: representasi tabel/database entity
- `middleware`: autentikasi JWT, role authorization, CORS
- `routes`: definisi endpoint API

Saat aplikasi dijalankan:

- Melakukan koneksi ke database MySQL
- Menjalankan auto-migration tabel
- Membuat akun admin default (jika belum ada)
- Membuat data default jenis perizinan (jika belum ada)

## Fitur Utama

- Login admin berbasis JWT
- Manajemen permohonan perizinan (list, detail, ubah status, kirim balasan)
- Dashboard statistik admin
- Manajemen notifikasi
- Manajemen jenis perizinan
- Manajemen akun admin (khusus `super_admin`)
- Upload dan download berkas persyaratan

## Tech Stack

- Go
- Gin
- GORM
- MySQL
- JWT
- SMTP (gomail)

## Prasyarat

- Go 1.23+ (sesuai `go.mod`)
- MySQL 8+

## Konfigurasi Environment

Project menyediakan file `back_end/.env.example`.

1. Buat file `.env` dari template:

```powershell
Copy-Item .env.example .env
```

Atau di macOS/Linux:

```bash
cp .env.example .env
```

2. Sesuaikan nilai variabel penting di `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dinkes_perizinan

SERVER_PORT=8080
GIN_MODE=debug

JWT_SECRET=your-secret-key
JWT_EXPIRY_HOURS=24

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@dinkes.makassar.go.id
```

Catatan:

- Sesuaikan `DB_PORT` dengan MySQL Anda (umumnya `3306`).
- `SMTP_*` wajib diisi jika fitur kirim email ingin aktif.

## Cara Setup dan Menjalankan

Jalankan dari folder `back_end`:

```bash
go mod tidy
go run main.go
```

Server akan berjalan di:

- `http://localhost:8080`
- Health check: `http://localhost:8080/health`

## Base URL API

- Base URL: `http://localhost:8080/api/v1`

Contoh endpoint publik:

- `POST /auth/login`
- `GET /jenis-perizinan`
- `POST /permohonan`

Contoh endpoint admin (butuh token):

- `GET /admin/permohonan`
- `GET /admin/dashboard/statistik`
- `GET /admin/notifikasi`

## Akun Admin Default

Jika belum ada admin di database, sistem akan membuat akun default dari `.env`:

- Username: `ADMIN_USERNAME`
- Password: `ADMIN_PASSWORD`

Disarankan langsung mengganti password setelah login pertama.

## Struktur Folder

```text
back_end/
|- config/
|- controllers/
|- dto/
|- middleware/
|- models/
|- repositories/
|- routes/
|- services/
|- uploads/
|- go.mod
|- main.go
`- README.md
```