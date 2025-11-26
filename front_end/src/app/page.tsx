"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form berhasil dikirim!");
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  src="/logo-kotamakassar.png"
                  alt="Logo Kota Makassar"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-blue-800">
                Dinas Kesehatan
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a href="#beranda" className="text-blue-800 hover:text-blue-600 font-medium">
                Beranda
              </a>
              <a href="#profil" className="text-blue-800 hover:text-blue-600 font-medium">
                Tentang Kami
              </a>
              <a href="#layanan" className="text-blue-800 hover:text-blue-600 font-medium">
                Layanan
              </a>
              <a href="#kontak" className="text-blue-800 hover:text-blue-600 font-medium">
                Kontak
              </a>
            </div>
            
            {/* Desktop Button */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Ajukan Perizinan
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-blue-800 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-blue-100">
              <a href="#beranda" className="block text-blue-800 hover:text-blue-600 font-medium py-2">
                Beranda
              </a>
              <a href="#profil" className="block text-blue-800 hover:text-blue-600 font-medium py-2">
                Tentang Kami
              </a>
              <a href="#layanan" className="block text-blue-800 hover:text-blue-600 font-medium py-2">
                Layanan
              </a>
              <a href="#kontak" className="block text-blue-800 hover:text-blue-600 font-medium py-2">
                Kontak
              </a>
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ajukan Perizinan
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6">
            Dinas Kesehatan
            <span className="block text-blue-600">Bidang PSDK</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Pengawasan Sumber Daya Kesehatan - Melayani masyarakat dalam bidang 
            perizinan dan persuratan kesehatan dengan profesional dan transparan
          </p>
        </div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">
              Profil Bidang PSDK
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
              <p>
                Bidang Pengawasan Sumber Daya Kesehatan (PSDK) bertanggung jawab 
                dalam pengawasan dan regulasi sumber daya kesehatan di wilayah 
                kerja Dinas Kesehatan.
              </p>
              <p>
                Kami memberikan pelayanan perizinan bagi tenaga kesehatan, 
                sarana kesehatan, dan alat kesehatan untuk menjamin mutu 
                pelayanan kesehatan yang optimal.
              </p>
              <p>
                Visi: Terwujudnya sistem pengawasan sumber daya kesehatan 
                yang efektif dan efisien untuk mendukung pelayanan kesehatan 
                yang berkualitas.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Layanan Kami</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Perizinan Tenaga Kesehatan</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Izin Sarana Kesehatan</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Sertifikasi Alat Kesehatan</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Perizinan Praktik Mandiri</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>Rekomendasi Penempatan Tenaga Kesehatan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">
            Informasi Kontak
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base text-gray-600">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Alamat</h4>
              <p>Jl. Kesehatan No. 123<br />Kota Administrasi</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Telepon</h4>
              <p>(021) 1234-5678</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg sm:col-span-2 md:col-span-1">
              <h4 className="font-semibold text-blue-800 mb-2">Email</h4>
              <p className="text-green-600 font-medium break-all">psdk@dinkes.go.id</p>
            </div>
          </div>
        </div>
      </main>

      {/* Form Popup Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                  Form Pengajuan Perizinan
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-900"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIK
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-900"
                    placeholder="Masukkan NIK"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-900"
                    placeholder="089xxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-900"
                    placeholder="contoh@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-900"
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Perizinan
                </label>
                <select className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-900">
                  <option>Pilih jenis perizinan</option>
                  <option>Perizinan Tenaga Kesehatan</option>
                  <option>Izin Sarana Kesehatan</option>
                  <option>Sertifikasi Alat Kesehatan</option>
                  <option>Perizinan Praktik Mandiri</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Berkas Persyaratan
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                  <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base inline-block">
                      Pilih Berkas
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX maksimal 10MB
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-0 sm:space-x-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-full sm:w-auto px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}