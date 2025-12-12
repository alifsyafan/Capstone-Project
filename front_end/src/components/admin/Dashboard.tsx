"use client";

import { Permohonan, StatistikDashboard } from "@/types";

interface DashboardProps {
  statistik: StatistikDashboard;
  permohonanTerbaru: Permohonan[];
  onLihatDetail: (permohonan: Permohonan) => void;
}

export default function Dashboard({ statistik, permohonanTerbaru, onLihatDetail }: DashboardProps) {
  const formatTanggal = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      baru: 'bg-yellow-100 text-yellow-800',
      diproses: 'bg-blue-100 text-blue-800',
      disetujui: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      baru: 'Baru',
      diproses: 'Diproses',
      disetujui: 'Disetujui',
      ditolak: 'Ditolak',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-500">Selamat datang di panel admin Dinas Kesehatan</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Total Permohonan</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{statistik.totalPermohonan}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Permohonan Baru</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{statistik.permohonanBaru}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Sedang Diproses</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{statistik.permohonanDiproses}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Selesai</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{statistik.permohonanSelesai}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Permohonan Terbaru */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Permohonan Terbaru</h3>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Permohonan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Perizinan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {permohonanTerbaru.map((permohonan) => (
                <tr key={permohonan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{permohonan.nomorPermohonan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{permohonan.pemohon.namaLengkap}</p>
                      <p className="text-xs text-gray-500">{permohonan.pemohon.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{permohonan.jenisPerizinan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTanggal(permohonan.tanggalMasuk)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(permohonan.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onLihatDetail(permohonan)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {permohonanTerbaru.map((permohonan) => (
            <div key={permohonan.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-blue-600">{permohonan.nomorPermohonan}</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{permohonan.pemohon.namaLengkap}</p>
                </div>
                {getStatusBadge(permohonan.status)}
              </div>
              <p className="text-xs text-gray-500 mb-1">{permohonan.pemohon.email}</p>
              <p className="text-xs text-gray-600 mb-2">{permohonan.jenisPerizinan}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{formatTanggal(permohonan.tanggalMasuk)}</p>
                <button
                  onClick={() => onLihatDetail(permohonan)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
