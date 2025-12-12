"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Dashboard from "@/components/admin/Dashboard";
import DaftarPermohonan from "@/components/admin/DaftarPermohonan";
import DetailPermohonan from "@/components/admin/DetailPermohonan";
import KelolaPerizinan from "@/components/admin/KelolaPerizinan";
import { Permohonan, JenisPerizinan, Notifikasi, StatistikDashboard } from "@/types";
import {
  authAPI,
  dashboardAPI,
  permohonanAPI,
  jenisPerizinanAPI,
  notifikasiAPI,
  mapPermohonanToFrontend,
  mapJenisPerizinanToFrontend,
  mapNotifikasiToFrontend,
} from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>([]);
  const [jenisPerizinanList, setJenisPerizinanList] = useState<JenisPerizinan[]>([]);
  const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [showNotifikasi, setShowNotifikasi] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [statistik, setStatistik] = useState<StatistikDashboard>({
    totalPermohonan: 0,
    permohonanBaru: 0,
    permohonanDiproses: 0,
    permohonanSelesai: 0,
  });

  // Cek autentikasi
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      const isLoggedIn = localStorage.getItem("adminLoggedIn");

      if (!token || isLoggedIn !== "true") {
        router.push("/admin/login");
        return;
      }

      try {
        const response = await authAPI.getProfile();
        if (response.success) {
          setIsAuthenticated(true);
        } else {
          authAPI.logout();
          router.push("/admin/login");
        }
      } catch {
        // Error koneksi, coba gunakan token yang ada
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch data dari API
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      // Fetch statistik
      const statsResponse = await dashboardAPI.getStatistik();
      if (statsResponse.success && statsResponse.data) {
        setStatistik({
          totalPermohonan: statsResponse.data.total_permohonan,
          permohonanBaru: statsResponse.data.permohonan_baru,
          permohonanDiproses: statsResponse.data.permohonan_diproses,
          permohonanSelesai: statsResponse.data.permohonan_selesai,
        });
      }

      // Fetch permohonan
      const permohonanResponse = await permohonanAPI.getAll({ per_page: 100 });
      if (permohonanResponse.success && permohonanResponse.data?.data) {
        const mappedData = permohonanResponse.data.data.map(mapPermohonanToFrontend);
        setPermohonanList(mappedData as unknown as Permohonan[]);
      } else {
        setPermohonanList([]);
      }

      // Fetch jenis perizinan
      const jpResponse = await jenisPerizinanAPI.getAll(false);
      if (jpResponse.success && jpResponse.data) {
        const mappedData = jpResponse.data.map(mapJenisPerizinanToFrontend);
        setJenisPerizinanList(mappedData);
      }

      // Fetch notifikasi
      const notifResponse = await notifikasiAPI.getAll(false);
      if (notifResponse.success && notifResponse.data) {
        const mappedData = notifResponse.data.map(mapNotifikasiToFrontend);
        setNotifikasi(mappedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    router.push("/admin/login");
  };

  // Handle kirim balasan email
  const handleKirimBalasan = async (permohonanId: string, balasan: string, status: 'disetujui' | 'ditolak', lampiran?: File, catatanAdmin?: string) => {
    try {
      const response = await permohonanAPI.kirimBalasan(permohonanId, {
        balasan_email: balasan,
        status: status,
        catatan_admin: catatanAdmin,
      }, lampiran);

      if (response.success) {
        const statusText = status === 'disetujui' ? 'disetujui' : 'ditolak';
        setSuccessMessage(`Permohonan telah ${statusText} dan email balasan telah dikirim ke pemohon!`);
        setShowSuccessModal(true);
        
        // Tandai notifikasi terkait permohonan ini sebagai dibaca
        const relatedNotif = notifikasi.find(n => n.permohonanId === permohonanId && !n.dibaca);
        if (relatedNotif) {
          await notifikasiAPI.markAsRead(relatedNotif.id);
        }
        
        setSelectedPermohonan(null);
        await fetchData();
        setActiveMenu("riwayat");
      } else {
        alert("Gagal mengirim balasan: " + response.message);
      }
    } catch {
      alert("Gagal terhubung ke server");
    }
  };

  // Handle proses permohonan
  const handleProsesPermohonan = async (permohonanId: string) => {
    try {
      const response = await permohonanAPI.updateStatus(permohonanId, {
        status: "diproses",
      });

      if (response.success) {
        // Tampilkan pesan sukses
        setSuccessMessage("Permohonan berhasil diproses! Email notifikasi telah dikirim ke pemohon.");
        setShowSuccessModal(true);
        
        // Tandai notifikasi terkait permohonan ini sebagai dibaca
        const relatedNotif = notifikasi.find(n => n.permohonanId === permohonanId && !n.dibaca);
        if (relatedNotif) {
          await notifikasiAPI.markAsRead(relatedNotif.id);
        }
        
        // Refresh data dan arahkan ke halaman "Sedang Diproses"
        await fetchData();
        setSelectedPermohonan(null);
        setActiveMenu("permohonan-diproses");
      } else {
        alert("Gagal memproses permohonan: " + response.message);
      }
    } catch {
      alert("Gagal terhubung ke server");
    }
  };

  // Handle tambah jenis perizinan
  const handleTambahPerizinan = async (perizinan: Omit<JenisPerizinan, 'id' | 'createdAt'>) => {
    try {
      const response = await jenisPerizinanAPI.create({
        nama: perizinan.nama,
        deskripsi: perizinan.deskripsi,
        persyaratan: perizinan.persyaratan,
        aktif: perizinan.aktif,
      });

      if (response.success) {
        fetchData();
      } else {
        alert("Gagal menambah perizinan: " + response.message);
      }
    } catch {
      alert("Gagal terhubung ke server");
    }
  };

  // Handle edit jenis perizinan
  const handleEditPerizinan = async (perizinan: JenisPerizinan) => {
    try {
      const response = await jenisPerizinanAPI.update(perizinan.id, {
        nama: perizinan.nama,
        deskripsi: perizinan.deskripsi,
        persyaratan: perizinan.persyaratan,
        aktif: perizinan.aktif,
      });

      if (response.success) {
        fetchData();
      } else {
        alert("Gagal mengupdate perizinan: " + response.message);
      }
    } catch {
      alert("Gagal terhubung ke server");
    }
  };

  // Handle hapus jenis perizinan
  const handleHapusPerizinan = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jenis perizinan ini?")) {
      return;
    }

    try {
      const response = await jenisPerizinanAPI.delete(id);

      if (response.success) {
        fetchData();
      } else {
        alert("Gagal menghapus perizinan: " + response.message);
      }
    } catch {
      alert("Gagal terhubung ke server");
    }
  };

  // Handle tandai notifikasi dibaca
  const handleBacaNotifikasi = async (notifId: string) => {
    try {
      await notifikasiAPI.markAsRead(notifId);
      setNotifikasi(prev =>
        prev.map(n => n.id === notifId ? { ...n, dibaca: true } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Render konten berdasarkan menu aktif
  const renderContent = () => {
    if (isLoading && permohonanList.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      );
    }

    if (selectedPermohonan) {
      return (
        <DetailPermohonan
          permohonan={selectedPermohonan}
          onBack={() => setSelectedPermohonan(null)}
          onKirimBalasan={handleKirimBalasan}
          onProses={handleProsesPermohonan}
        />
      );
    }

    switch (activeMenu) {
      case "dashboard":
        return (
          <Dashboard
            statistik={statistik}
            permohonanTerbaru={permohonanList.slice(0, 5)}
            onLihatDetail={(permohonan: Permohonan) => setSelectedPermohonan(permohonan)}
          />
        );
      case "permohonan-baru":
        return (
          <DaftarPermohonan
            permohonanList={permohonanList.filter(p => p.status === "baru")}
            title="Permohonan Baru"
            onLihatDetail={(permohonan: Permohonan) => setSelectedPermohonan(permohonan)}
          />
        );
      case "permohonan-diproses":
        return (
          <DaftarPermohonan
            permohonanList={permohonanList.filter(p => p.status === "diproses")}
            title="Permohonan Sedang Diproses"
            onLihatDetail={(permohonan: Permohonan) => setSelectedPermohonan(permohonan)}
          />
        );
      case "riwayat":
        return (
          <DaftarPermohonan
            permohonanList={permohonanList.filter(p => p.status === "disetujui" || p.status === "ditolak")}
            title="Riwayat Permohonan"
            onLihatDetail={(permohonan: Permohonan) => setSelectedPermohonan(permohonan)}
          />
        );
      case "semua-permohonan":
        return (
          <DaftarPermohonan
            permohonanList={permohonanList}
            title="Semua Permohonan"
            onLihatDetail={(permohonan: Permohonan) => setSelectedPermohonan(permohonan)}
          />
        );
      case "kelola-perizinan":
        return (
          <KelolaPerizinan
            jenisPerizinanList={jenisPerizinanList}
            onTambah={handleTambahPerizinan}
            onEdit={handleEditPerizinan}
            onHapus={handleHapusPerizinan}
          />
        );
      default:
        return <Dashboard statistik={statistik} permohonanTerbaru={permohonanList.slice(0, 5)} onLihatDetail={(permohonan: Permohonan) => setSelectedPermohonan(permohonan)} />;
    }
  };

  // Loading state saat mengecek autentikasi
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Handler untuk menu sidebar - reset selectedPermohonan saat berpindah menu
  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setSelectedPermohonan(null); // Reset detail permohonan saat berpindah menu
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeMenu={activeMenu}
        onMenuClick={handleMenuClick}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        jumlahPermohonanBaru={statistik.permohonanBaru}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}>
        {/* Header */}
        <AdminHeader
          notifikasi={notifikasi}
          showNotifikasi={showNotifikasi}
          onToggleNotifikasi={() => setShowNotifikasi(!showNotifikasi)}
          onBacaNotifikasi={handleBacaNotifikasi}
          onLihatPermohonan={(permohonanId) => {
            const permohonan = permohonanList.find(p => p.id === permohonanId);
            if (permohonan) {
              setSelectedPermohonan(permohonan);
              setShowNotifikasi(false);
            }
          }}
          onLogout={handleLogout}
        />

        {/* Content */}
        <main className="p-3 sm:p-4 md:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Berhasil!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
