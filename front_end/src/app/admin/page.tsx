"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Dashboard from "@/components/admin/Dashboard";
import DaftarPermohonan from "@/components/admin/DaftarPermohonan";
import DetailPermohonan from "@/components/admin/DetailPermohonan";
import KelolaPerizinan from "@/components/admin/KelolaPerizinan";
import { Permohonan, JenisPerizinan, Notifikasi, StatistikDashboard } from "@/types";

// Data dummy untuk demo
const dummyJenisPerizinan: JenisPerizinan[] = [
  { id: "1", nama: "Izin Penelitian", deskripsi: "Izin untuk melakukan penelitian di lingkungan Dinkes", persyaratan: ["Surat pengantar dari instansi", "Proposal penelitian", "KTP"], aktif: true, createdAt: new Date() },
  { id: "2", nama: "Izin Pengambilan Data Awal", deskripsi: "Izin untuk survei pendahuluan", persyaratan: ["Surat pengantar", "Proposal"], aktif: true, createdAt: new Date() },
  { id: "3", nama: "Izin Permohonan Magang", deskripsi: "Izin untuk PKL/Magang", persyaratan: ["Surat dari kampus", "CV", "Transkrip nilai"], aktif: true, createdAt: new Date() },
  { id: "4", nama: "Izin Kepaniteraan Klinik (Coas)", deskripsi: "Izin untuk mahasiswa profesi kesehatan", persyaratan: ["Surat pengantar fakultas", "Logbook"], aktif: true, createdAt: new Date() },
  { id: "5", nama: "Izin Kunjungan Lapangan", deskripsi: "Izin untuk kunjungan studi banding", persyaratan: ["Surat permohonan resmi", "Daftar peserta"], aktif: true, createdAt: new Date() },
];

const dummyPermohonan: Permohonan[] = [
  {
    id: "PRM001",
    pemohon: { namaLengkap: "Ahmad Rizki", nomorTelepon: "081234567890", email: "ahmad@email.com", alamat: "Jl. Sudirman No. 123, Makassar" },
    jenisPerizinan: "Izin Penelitian",
    berkas: ["proposal.pdf", "surat_pengantar.pdf"],
    catatan: "Penelitian tentang kesehatan masyarakat",
    status: "baru",
    tanggalMasuk: new Date("2025-12-08T10:00:00"),
  },
  {
    id: "PRM002",
    pemohon: { namaLengkap: "Siti Nurhaliza", nomorTelepon: "082345678901", email: "siti@email.com", alamat: "Jl. Pettarani No. 45, Makassar" },
    jenisPerizinan: "Izin Permohonan Magang",
    berkas: ["cv.pdf", "surat_kampus.pdf", "transkrip.pdf"],
    status: "diproses",
    tanggalMasuk: new Date("2025-12-07T14:30:00"),
    tanggalDiproses: new Date("2025-12-08T09:00:00"),
  },
  {
    id: "PRM003",
    pemohon: { namaLengkap: "Budi Santoso", nomorTelepon: "083456789012", email: "budi@email.com", alamat: "Jl. AP Pettarani No. 78, Makassar" },
    jenisPerizinan: "Izin Pengambilan Data Awal",
    berkas: ["proposal.pdf"],
    status: "disetujui",
    tanggalMasuk: new Date("2025-12-05T11:00:00"),
    tanggalDiproses: new Date("2025-12-06T10:00:00"),
    tanggalSelesai: new Date("2025-12-07T15:00:00"),
    balasanEmail: "Permohonan Anda telah disetujui. Silakan ambil surat izin di kantor kami.",
  },
  {
    id: "PRM004",
    pemohon: { namaLengkap: "Dewi Lestari", nomorTelepon: "084567890123", email: "dewi@email.com", alamat: "Jl. Boulevard No. 56, Makassar" },
    jenisPerizinan: "Izin Kunjungan Lapangan",
    berkas: ["surat_permohonan.pdf", "daftar_peserta.pdf"],
    catatan: "Kunjungan dari Universitas Hasanuddin",
    status: "baru",
    tanggalMasuk: new Date("2025-12-08T08:15:00"),
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>(dummyPermohonan);
  const [jenisPerizinanList, setJenisPerizinanList] = useState<JenisPerizinan[]>(dummyJenisPerizinan);
  const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [showNotifikasi, setShowNotifikasi] = useState(false);

  // Cek autentikasi
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoginTime");
    router.push("/admin/login");
  };

  // Statistik dashboard
  const statistik: StatistikDashboard = {
    totalPermohonan: permohonanList.length,
    permohonanBaru: permohonanList.filter(p => p.status === "baru").length,
    permohonanDiproses: permohonanList.filter(p => p.status === "diproses").length,
    permohonanSelesai: permohonanList.filter(p => p.status === "disetujui" || p.status === "ditolak").length,
  };

  // Generate notifikasi dari permohonan baru
  useEffect(() => {
    const permohonanBaru = permohonanList.filter(p => p.status === "baru");
    const newNotifikasi: Notifikasi[] = permohonanBaru.map(p => ({
      id: `notif-${p.id}`,
      pesan: `Permohonan baru dari ${p.pemohon.namaLengkap} - ${p.jenisPerizinan}`,
      permohonanId: p.id,
      dibaca: false,
      tanggal: p.tanggalMasuk,
    }));
    setNotifikasi(newNotifikasi);
  }, [permohonanList]);

  // Handle kirim balasan email
  const handleKirimBalasan = (permohonanId: string, balasan: string, status: 'disetujui' | 'ditolak') => {
    setPermohonanList(prev => 
      prev.map(p => {
        if (p.id === permohonanId) {
          return {
            ...p,
            status,
            balasanEmail: balasan,
            tanggalSelesai: new Date(),
          };
        }
        return p;
      })
    );
    setSelectedPermohonan(null);
    alert(`Email balasan telah dikirim ke pemohon!`);
  };

  // Handle proses permohonan
  const handleProsesPermohonan = (permohonanId: string) => {
    setPermohonanList(prev =>
      prev.map(p => {
        if (p.id === permohonanId) {
          return {
            ...p,
            status: "diproses" as const,
            tanggalDiproses: new Date(),
          };
        }
        return p;
      })
    );
  };

  // Handle tambah jenis perizinan
  const handleTambahPerizinan = (perizinan: Omit<JenisPerizinan, 'id' | 'createdAt'>) => {
    const newPerizinan: JenisPerizinan = {
      ...perizinan,
      id: `${jenisPerizinanList.length + 1}`,
      createdAt: new Date(),
    };
    setJenisPerizinanList(prev => [...prev, newPerizinan]);
  };

  // Handle edit jenis perizinan
  const handleEditPerizinan = (perizinan: JenisPerizinan) => {
    setJenisPerizinanList(prev =>
      prev.map(p => p.id === perizinan.id ? perizinan : p)
    );
  };

  // Handle hapus jenis perizinan
  const handleHapusPerizinan = (id: string) => {
    setJenisPerizinanList(prev => prev.filter(p => p.id !== id));
  };

  // Handle tandai notifikasi dibaca
  const handleBacaNotifikasi = (notifId: string) => {
    setNotifikasi(prev =>
      prev.map(n => n.id === notifId ? { ...n, dibaca: true } : n)
    );
  };

  // Render konten berdasarkan menu aktif
  const renderContent = () => {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
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
