"use client";

import { useState, useRef } from "react";
import { Permohonan } from "@/types";
import { getDownloadUrl } from "@/lib/api";

interface DetailPermohonanProps {
  permohonan: Permohonan;
  onBack: () => void;
  onKirimBalasan: (permohonanId: string, balasan: string, status: 'disetujui' | 'ditolak', lampiran?: File, catatanAdmin?: string) => void | Promise<void>;
  onProses: (permohonanId: string) => void | Promise<void>;
}

export default function DetailPermohonan({ permohonan, onBack, onKirimBalasan, onProses }: DetailPermohonanProps) {
  const [showBalasanModal, setShowBalasanModal] = useState(false);
  const [balasanText, setBalasanText] = useState("");
  const [statusBalasan, setStatusBalasan] = useState<'disetujui' | 'ditolak'>('disetujui');
  const [catatanAdmin, setCatatanAdmin] = useState("");
  const [lampiran, setLampiran] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTanggal = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      baru: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      diproses: 'bg-blue-100 text-blue-800 border-blue-200',
      disetujui: 'bg-green-100 text-green-800 border-green-200',
      ditolak: 'bg-red-100 text-red-800 border-red-200',
    };
    const labels: Record<string, string> = {
      baru: 'Baru',
      diproses: 'Sedang Diproses',
      disetujui: 'Disetujui',
      ditolak: 'Ditolak',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handleKirimBalasan = () => {
    if (!balasanText.trim()) {
      alert("Mohon isi pesan balasan terlebih dahulu");
      return;
    }
    onKirimBalasan(permohonan.id, balasanText, statusBalasan, lampiran || undefined, catatanAdmin || undefined);
    setShowBalasanModal(false);
    setBalasanText("");
    setCatatanAdmin("");
    setLampiran(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Template email balasan
  const templateSetuju = `Yth. ${permohonan.pemohon.namaLengkap},

Dengan hormat,

Permohonan ${permohonan.jenisPerizinan} Anda dengan nomor ${permohonan.nomorPermohonan} telah kami SETUJUI.

Silakan mengambil surat izin di kantor Dinas Kesehatan Kota Makassar pada hari dan jam kerja dengan membawa:
1. KTP asli
2. Bukti pengajuan (print email ini)

Alamat: Jl. Teduh Bersinar No. 1, Makassar
Jam Pelayanan: Senin - Jumat, 08.00 - 16.00 WITA

Terima kasih atas kepercayaan Anda menggunakan layanan kami.

Hormat kami,
Dinas Kesehatan Kota Makassar`;

  const templateTolak = `Yth. ${permohonan.pemohon.namaLengkap},

Dengan hormat,

Mohon maaf, permohonan ${permohonan.jenisPerizinan} Anda dengan nomor ${permohonan.nomorPermohonan} TIDAK DAPAT kami setujui.

Alasan penolakan: [Silakan isi alasan]

Anda dapat mengajukan permohonan kembali setelah memenuhi persyaratan yang diperlukan.

Jika ada pertanyaan, silakan hubungi kami di:
Telp: (0411) 123-4567
Email: dinkes@makassarkota.go.id

Hormat kami,
Dinas Kesehatan Kota Makassar`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onBack}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Detail Permohonan</h2>
            <p className="text-xs sm:text-base text-gray-500">No. {permohonan.nomorPermohonan}</p>
          </div>
        </div>
        {getStatusBadge(permohonan.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Info Pemohon */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Data Pemohon */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Data Pemohon
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Nama Lengkap</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800">{permohonan.pemohon.namaLengkap}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800 break-all">{permohonan.pemohon.email}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Nomor Telepon</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800">{permohonan.pemohon.nomorTelepon}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Alamat</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800">{permohonan.pemohon.alamat}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Perizinan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-green-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Data Perizinan
              </h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Jenis Perizinan</p>
                <p className="text-sm sm:text-base font-medium text-gray-800">{permohonan.jenisPerizinan}</p>
              </div>
              
              {permohonan.catatan && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Catatan dari Pemohon</p>
                  <p className="text-sm sm:text-base font-medium text-gray-800 bg-gray-50 p-2 sm:p-3 rounded-lg">{permohonan.catatan}</p>
                </div>
              )}

              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Berkas yang Dilampirkan</p>
                <div className="space-y-2">
                  {permohonan.berkasData && permohonan.berkasData.length > 0 ? (
                    permohonan.berkasData.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 17v-6h1v6h-1zm2.5 0v-6h1.25c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25H11zm2.5-6h1.5v1h-1.5v2h1.5v1h-1.5v2h-1v-6h1.5z"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 block truncate">{file.nama_asli}</span>
                            <p className="text-xs text-gray-500">{(file.ukuran / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <a 
                          href={getDownloadUrl(file.nama_file, file.nama_asli)}
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex-shrink-0 ml-2"
                        >
                          Unduh
                        </a>
                      </div>
                    ))
                  ) : (
                    permohonan.berkas.map((fileName, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 17v-6h1v6h-1zm2.5 0v-6h1.25c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25H11zm2.5-6h1.5v1h-1.5v2h1.5v1h-1.5v2h-1v-6h1.5z"/>
                          </svg>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{fileName}</span>
                        </div>
                        <span className="text-gray-400 text-xs sm:text-sm flex-shrink-0 ml-2">-</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Laporan Hasil Permohonan (jika sudah selesai) */}
          {(permohonan.status === 'disetujui' || permohonan.status === 'ditolak') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 ${
                permohonan.status === 'disetujui' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <h3 className="font-semibold text-gray-800 flex items-center text-sm sm:text-base">
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                    permohonan.status === 'disetujui' ? 'text-green-600' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Laporan Hasil Permohonan
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {/* Status Keputusan */}
                <div className={`flex items-center p-3 sm:p-4 rounded-lg ${
                  permohonan.status === 'disetujui' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${
                    permohonan.status === 'disetujui' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {permohonan.status === 'disetujui' ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm sm:text-base font-bold ${
                      permohonan.status === 'disetujui' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Permohonan {permohonan.status === 'disetujui' ? 'DISETUJUI' : 'DITOLAK'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {permohonan.tanggalSelesai && formatTanggal(permohonan.tanggalSelesai)}
                    </p>
                  </div>
                </div>

                {/* Catatan Admin */}
                {permohonan.catatanAdmin && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Catatan dari Admin
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                      <p className="text-sm text-gray-700">{permohonan.catatanAdmin}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Balasan Email (jika sudah ada) */}
          {permohonan.balasanEmail && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-purple-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Surat Balasan Email
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Terkirim
                  </span>
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Dikirim ke: <span className="font-medium ml-1 text-gray-700">{permohonan.pemohon.email}</span>
                </div>

                {/* Lampiran Surat */}
                {permohonan.lampiranSurat && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Lampiran Surat:
                    </p>
                    <div className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 17v-6h1v6h-1zm2.5 0v-6h1.25c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25H11zm2.5-6h1.5v1h-1.5v2h1.5v1h-1.5v2h-1v-6h1.5z"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-700 block truncate">
                            Surat Keputusan Perizinan
                          </span>
                          <p className="text-xs text-gray-500">Dokumen PDF</p>
                        </div>
                      </div>
                      <a 
                        href={getDownloadUrl(permohonan.lampiranSurat.split('/').pop() || '', 'Surat_Keputusan.pdf')}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ml-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Unduh</span>
                      </a>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Isi Email:</p>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 p-3 sm:p-4 font-sans overflow-x-auto max-h-64 overflow-y-auto">
                    {permohonan.balasanEmail}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Timeline & Actions */}
        <div className="space-y-4 sm:space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Timeline</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-800">Permohonan Masuk</p>
                  <p className="text-xs text-gray-500 break-words">{formatTanggal(permohonan.tanggalMasuk)}</p>
                </div>
              </div>

              {permohonan.tanggalDiproses && (
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800">Mulai Diproses</p>
                    <p className="text-xs text-gray-500 break-words">{formatTanggal(permohonan.tanggalDiproses)}</p>
                  </div>
                </div>
              )}

              {permohonan.tanggalSelesai && (
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${permohonan.status === 'disetujui' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${permohonan.status === 'disetujui' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {permohonan.status === 'disetujui' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                      {permohonan.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}
                    </p>
                    <p className="text-xs text-gray-500 break-words">{formatTanggal(permohonan.tanggalSelesai)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {(permohonan.status === 'baru' || permohonan.status === 'diproses') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Aksi</h3>
              <div className="space-y-2 sm:space-y-3">
                {permohonan.status === 'baru' && (
                  <button
                    onClick={() => onProses(permohonan.id)}
                    className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Proses Permohonan</span>
                  </button>
                )}

                {permohonan.status === 'diproses' && (
                  <>
                    <button
                      onClick={() => {
                        setStatusBalasan('disetujui');
                        setBalasanText(templateSetuju);
                        setShowBalasanModal(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Setujui & Kirim Email</span>
                    </button>

                    <button
                      onClick={() => {
                        setStatusBalasan('ditolak');
                        setBalasanText(templateTolak);
                        setShowBalasanModal(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Tolak & Kirim Email</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Kontak Cepat</h3>
            <div className="space-y-2 sm:space-y-3">
              <a
                href={`mailto:${permohonan.pemohon.email}`}
                className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs sm:text-sm text-gray-700 truncate">{permohonan.pemohon.email}</span>
              </a>
              <a
                href={`https://wa.me/${permohonan.pemohon.nomorTelepon.replace(/^0/, '62')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-xs sm:text-sm text-green-700">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Balasan Email */}
      {showBalasanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            <div className={`px-4 sm:px-6 py-3 sm:py-4 ${statusBalasan === 'disetujui' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
              <h3 className="text-base sm:text-lg font-bold">
                {statusBalasan === 'disetujui' ? 'Setujui Permohonan' : 'Tolak Permohonan'}
              </h3>
              <p className="text-xs sm:text-sm opacity-90">Kirim balasan email ke pemohon</p>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Penerima
                  </label>
                  <input
                    type="text"
                    value={permohonan.pemohon.email}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Isi Pesan Email <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={balasanText}
                    onChange={(e) => setBalasanText(e.target.value)}
                    rows={8}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
                    placeholder="Tulis pesan balasan..."
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Catatan Internal (tidak dikirim)
                  </label>
                  <textarea
                    value={catatanAdmin}
                    onChange={(e) => setCatatanAdmin(e.target.value)}
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
                    placeholder="Catatan untuk arsip internal..."
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Lampiran Surat (Opsional)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setLampiran(e.target.files?.[0] || null)}
                      className="hidden"
                      id="lampiran-file"
                    />
                    <label
                      htmlFor="lampiran-file"
                      className="flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm text-gray-700">Pilih File</span>
                    </label>
                    {lampiran && (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg flex-1 min-w-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs sm:text-sm text-blue-700 truncate flex-1">{lampiran.name}</span>
                        <button
                          onClick={() => {
                            setLampiran(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: PDF, DOC, DOCX (Maks. 5MB)</p>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowBalasanModal(false)}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleKirimBalasan}
                className={`w-full sm:w-auto px-4 sm:px-5 py-2 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm ${
                  statusBalasan === 'disetujui' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Kirim Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
