# Frontend - Sistem Pengajuan Perizinan Dinas Kesehatan

Frontend ini adalah aplikasi web untuk:

- Halaman publik pengajuan perizinan oleh masyarakat
- Panel admin untuk memproses permohonan

Aplikasi dibangun dengan Next.js (App Router), React, TypeScript, dan Tailwind CSS.

## Deskripsi Singkat

Frontend berkomunikasi dengan backend API untuk:

- Mengambil daftar jenis perizinan
- Mengirim form pengajuan beserta upload berkas
- Login admin
- Menampilkan dashboard, daftar permohonan, dan notifikasi admin

Integrasi API ada di `src/lib/api.ts` dengan base URL dari:

- `NEXT_PUBLIC_API_URL`
- Default fallback: `http://localhost:8080/api/v1`

## Fitur Utama

- Landing page informasi layanan
- Form pengajuan perizinan online + upload file
- Login admin berbasis JWT token
- Dashboard admin (statistik dan permohonan terbaru)
- Manajemen permohonan dan status
- Manajemen jenis perizinan
- Manajemen admin (untuk super admin)

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Prasyarat

- Node.js 20+
- npm
- Backend sudah berjalan di lokal (default `http://localhost:8080`)

## Setup Environment

Buat file `.env.local` di folder `front_end`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Jika backend berjalan di host/port lain, sesuaikan nilainya.

## Cara Setup dan Menjalankan

Jalankan dari folder `front_end`:

```bash
npm install
npm run dev
```

Akses aplikasi di:

- `http://localhost:3000`

## Script yang Tersedia

- `npm run dev` menjalankan mode development
- `npm run build` build production
- `npm run start` menjalankan hasil build production
- `npm run lint` menjalankan ESLint

## Struktur Folder

```text
front_end/
|- public/
|- src/
|  |- app/
|  |  |- admin/
|  |  |- layout.tsx
|  |  `- page.tsx
|  |- components/
|  |- lib/
|  `- types/
|- package.json
`- README.md
```

## Alur Menjalankan Full Project

1. Jalankan backend di `back_end` pada port `8080`.
2. Jalankan frontend di `front_end` pada port `3000`.
3. Buka `http://localhost:3000` untuk user publik.
4. Buka `http://localhost:3000/admin/login` untuk admin.
