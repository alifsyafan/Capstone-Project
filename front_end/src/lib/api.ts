// API Service for communicating with backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
};

// Generic API response type
export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ============== Auth API ==============

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_at: string;
  admin: {
    id: string;
    username: string;
    email: string;
    nama_lengkap: string;
  };
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<APIResponse<LoginResponse>> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getProfile: async (): Promise<APIResponse<LoginResponse['admin']>> => {
    const response = await authFetch(`${API_URL}/auth/profile`);
    return response.json();
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminLoginTime');
    }
  },
};

// ============== Jenis Perizinan API ==============

export interface JenisPerizinanData {
  id: string;
  nama: string;
  deskripsi: string;
  persyaratan: string[];
  aktif: boolean;
  created_at: string;
}

export interface CreateJenisPerizinanRequest {
  nama: string;
  deskripsi: string;
  persyaratan: string[];
  aktif: boolean;
}

export interface UpdateJenisPerizinanRequest {
  nama?: string;
  deskripsi?: string;
  persyaratan?: string[];
  aktif?: boolean;
}

export const jenisPerizinanAPI = {
  getAll: async (aktifOnly: boolean = false): Promise<APIResponse<JenisPerizinanData[]>> => {
    const response = await fetch(`${API_URL}/jenis-perizinan?aktif_only=${aktifOnly}`);
    return response.json();
  },

  getById: async (id: string): Promise<APIResponse<JenisPerizinanData>> => {
    const response = await fetch(`${API_URL}/jenis-perizinan/${id}`);
    return response.json();
  },

  create: async (data: CreateJenisPerizinanRequest): Promise<APIResponse<JenisPerizinanData>> => {
    const response = await authFetch(`${API_URL}/admin/jenis-perizinan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: UpdateJenisPerizinanRequest): Promise<APIResponse<JenisPerizinanData>> => {
    const response = await authFetch(`${API_URL}/admin/jenis-perizinan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string): Promise<APIResponse> => {
    const response = await authFetch(`${API_URL}/admin/jenis-perizinan/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// ============== Permohonan API ==============

export interface PemohonData {
  id: string;
  nama_lengkap: string;
  nomor_telepon: string;
  email: string;
  alamat: string;
}

export interface BerkasData {
  id: string;
  nama_file: string;
  nama_asli: string;
  path: string;
  ukuran: number;
  mime_type: string;
  created_at: string;
}

export interface PermohonanData {
  id: string;
  nomor_permohonan: string;
  pemohon: PemohonData;
  jenis_perizinan: JenisPerizinanData;
  berkas: BerkasData[];
  catatan: string;
  status: 'baru' | 'diproses' | 'disetujui' | 'ditolak';
  tanggal_masuk: string;
  tanggal_diproses?: string;
  tanggal_selesai?: string;
  balasan_email?: string;
  catatan_admin?: string;
  lampiran_surat?: string;
  created_at: string;
}

export interface PermohonanListResponse {
  data: PermohonanData[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CreatePermohonanRequest {
  nama_lengkap: string;
  nomor_telepon: string;
  email: string;
  alamat: string;
  jenis_perizinan_id: string;
  catatan?: string;
}

export interface UpdateStatusRequest {
  status: 'baru' | 'diproses' | 'disetujui' | 'ditolak';
  catatan_admin?: string;
}

export interface KirimBalasanRequest {
  balasan_email: string;
  status: 'disetujui' | 'ditolak';
  catatan_admin?: string;
}

export const permohonanAPI = {
  // Public endpoint - submit permohonan baru
  create: async (data: CreatePermohonanRequest, files: File[]): Promise<APIResponse<PermohonanData>> => {
    const formData = new FormData();
    formData.append('nama_lengkap', data.nama_lengkap);
    formData.append('nomor_telepon', data.nomor_telepon);
    formData.append('email', data.email);
    formData.append('alamat', data.alamat);
    formData.append('jenis_perizinan_id', data.jenis_perizinan_id);
    if (data.catatan) {
      formData.append('catatan', data.catatan);
    }

    files.forEach((file) => {
      formData.append('berkas', file);
    });

    const response = await fetch(`${API_URL}/permohonan`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Admin endpoints
  getAll: async (params?: { page?: number; per_page?: number; status?: string; search?: string }): Promise<APIResponse<PermohonanListResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);

    const response = await authFetch(`${API_URL}/admin/permohonan?${searchParams.toString()}`);
    return response.json();
  },

  getById: async (id: string): Promise<APIResponse<PermohonanData>> => {
    const response = await authFetch(`${API_URL}/admin/permohonan/${id}`);
    return response.json();
  },

  getByStatus: async (status: string): Promise<APIResponse<PermohonanData[]>> => {
    const response = await authFetch(`${API_URL}/admin/permohonan/status/${status}`);
    return response.json();
  },

  updateStatus: async (id: string, data: UpdateStatusRequest): Promise<APIResponse> => {
    const response = await authFetch(`${API_URL}/admin/permohonan/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  kirimBalasan: async (id: string, data: KirimBalasanRequest, lampiran?: File): Promise<APIResponse> => {
    const formData = new FormData();
    formData.append('balasan_email', data.balasan_email);
    formData.append('status', data.status);
    if (data.catatan_admin) {
      formData.append('catatan_admin', data.catatan_admin);
    }
    if (lampiran) {
      formData.append('lampiran', lampiran);
    }

    const response = await authFetch(`${API_URL}/admin/permohonan/${id}/balasan`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },
};

// ============== Dashboard API ==============

export interface StatistikData {
  total_permohonan: number;
  permohonan_baru: number;
  permohonan_diproses: number;
  permohonan_selesai: number;
  permohonan_disetujui: number;
  permohonan_ditolak: number;
}

export const dashboardAPI = {
  getStatistik: async (): Promise<APIResponse<StatistikData>> => {
    const response = await authFetch(`${API_URL}/admin/dashboard/statistik`);
    return response.json();
  },

  getRecentPermohonan: async (): Promise<APIResponse<PermohonanData[]>> => {
    const response = await authFetch(`${API_URL}/admin/dashboard/recent`);
    return response.json();
  },
};

// ============== Notifikasi API ==============

export interface NotifikasiData {
  id: string;
  permohonan_id: string;
  pesan: string;
  dibaca: boolean;
  tanggal: string;
}

export const notifikasiAPI = {
  getAll: async (unreadOnly: boolean = false): Promise<APIResponse<NotifikasiData[]>> => {
    const response = await authFetch(`${API_URL}/admin/notifikasi?unread_only=${unreadOnly}`);
    return response.json();
  },

  countUnread: async (): Promise<APIResponse<{ count: number }>> => {
    const response = await authFetch(`${API_URL}/admin/notifikasi/count`);
    return response.json();
  },

  markAsRead: async (id: string): Promise<APIResponse> => {
    const response = await authFetch(`${API_URL}/admin/notifikasi/${id}/read`, {
      method: 'PATCH',
    });
    return response.json();
  },

  markAllAsRead: async (): Promise<APIResponse> => {
    const response = await authFetch(`${API_URL}/admin/notifikasi/read-all`, {
      method: 'PATCH',
    });
    return response.json();
  },
};

// ============== Helper Functions ==============

// Convert API response to frontend format
export const mapPermohonanToFrontend = (data: PermohonanData) => {
  return {
    id: data.id,
    nomorPermohonan: data.nomor_permohonan,
    pemohon: {
      namaLengkap: data.pemohon.nama_lengkap,
      nomorTelepon: data.pemohon.nomor_telepon,
      email: data.pemohon.email,
      alamat: data.pemohon.alamat,
    },
    jenisPerizinan: data.jenis_perizinan.nama,
    jenisPerizinanId: data.jenis_perizinan.id,
    berkas: data.berkas.map(b => b.nama_asli),
    berkasData: data.berkas,
    catatan: data.catatan,
    status: data.status,
    tanggalMasuk: new Date(data.tanggal_masuk),
    tanggalDiproses: data.tanggal_diproses ? new Date(data.tanggal_diproses) : undefined,
    tanggalSelesai: data.tanggal_selesai ? new Date(data.tanggal_selesai) : undefined,
    balasanEmail: data.balasan_email,
    catatanAdmin: data.catatan_admin,
    lampiranSurat: data.lampiran_surat,
  };
};

export const mapJenisPerizinanToFrontend = (data: JenisPerizinanData) => {
  return {
    id: data.id,
    nama: data.nama,
    deskripsi: data.deskripsi,
    persyaratan: data.persyaratan || [],
    aktif: data.aktif,
    createdAt: new Date(data.created_at),
  };
};

export const mapNotifikasiToFrontend = (data: NotifikasiData) => {
  return {
    id: data.id,
    permohonanId: data.permohonan_id,
    pesan: data.pesan,
    dibaca: data.dibaca,
    tanggal: new Date(data.tanggal),
  };
};

// Get file download URL
export const getFileUrl = (path: string): string => {
  const baseUrl = API_URL.replace('/api/v1', '');
  return `${baseUrl}/${path}`;
};

// Get file download URL with original filename
export const getDownloadUrl = (filename: string, originalName: string): string => {
  const baseUrl = API_URL.replace('/api/v1', '');
  return `${baseUrl}/download/${filename}?name=${encodeURIComponent(originalName)}`;
};
