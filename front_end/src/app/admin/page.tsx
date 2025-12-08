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
  const handleKirimBalasan = async (permohonanId: string, balasan: string, status: 'disetujui' | 'ditolak') => {
    try {
      const response = await permohonanAPI.kirimBalasan(permohonanId, {
        balasan_email: balasan,
        status: status,
      });

      if (response.success) {
        alert("Email balasan telah dikirim ke pemohon!");
        setSelectedPermohonan(null);
        fetchData();
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
        fetchData();
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        jumlahPermohonanBaru={statistik.permohonanBaru}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
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
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
