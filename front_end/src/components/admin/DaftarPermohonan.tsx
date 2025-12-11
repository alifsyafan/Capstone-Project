"use client";

import { useState } from "react";
import { Permohonan } from "@/types";

interface DaftarPermohonanProps {
  permohonanList: Permohonan[];
  title: string;
  onLihatDetail: (permohonan: Permohonan) => void;
}

export default function DaftarPermohonan({ permohonanList, title, onLihatDetail }: DaftarPermohonanProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("");

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

  // Filter permohonan
  const filteredPermohonan = permohonanList.filter(p => {
    const matchSearch = p.pemohon.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.pemohon.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = filterJenis === "" || p.jenisPerizinan === filterJenis;
    return matchSearch && matchJenis;
  });

  // Get unique jenis perizinan
  const jenisPerizananOptions = [...new Set(permohonanList.map(p => p.jenisPerizinan))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500">{filteredPermohonan.length} permohonan ditemukan</p>
      </div>

      {/* Filter dan Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ID, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Filter Jenis */}
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="">Semua Jenis Perizinan</option>
            {jenisPerizananOptions.map((jenis) => (
              <option key={jenis} value={jenis}>{jenis}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Permohonan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredPermohonan.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">Tidak ada permohonan ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Permohonan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Perizinan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPermohonan.map((permohonan) => (
                  <tr key={permohonan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{permohonan.nomorPermohonan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{permohonan.pemohon.namaLengkap}</p>
                        <p className="text-xs text-gray-500">{permohonan.pemohon.email}</p>
                        <p className="text-xs text-gray-500">{permohonan.pemohon.nomorTelepon}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{permohonan.jenisPerizinan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTanggal(permohonan.tanggalMasuk)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(permohonan.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onLihatDetail(permohonan)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
