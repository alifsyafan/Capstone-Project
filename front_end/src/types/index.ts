// Types untuk aplikasi perizinan

export interface JenisPerizinan {
  id: string;
  nama: string;
  deskripsi: string;
  persyaratan: string[];
  aktif: boolean;
  createdAt: Date;
}

export interface Pemohon {
  namaLengkap: string;
  nomorTelepon: string;
  email: string;
  alamat: string;
}

export interface Berkas {
  id: string;
  nama_asli: string;
  nama_file: string;
  path: string;
  ukuran: number;
  tipe: string;
}

export interface Permohonan {
  id: string;
  pemohon: Pemohon;
  jenisPerizinan: string;
  berkas: string[];
  berkasData?: Berkas[];
  catatan?: string;
  status: 'baru' | 'diproses' | 'disetujui' | 'ditolak';
  tanggalMasuk: Date;
  tanggalDiproses?: Date;
  tanggalSelesai?: Date;
  balasanEmail?: string;
  catatanAdmin?: string;
}

export interface Notifikasi {
  id: string;
  pesan: string;
  permohonanId: string;
  dibaca: boolean;
  tanggal: Date;
}

export interface StatistikDashboard {
  totalPermohonan: number;
  permohonanBaru: number;
  permohonanDiproses: number;
  permohonanSelesai: number;
}
