"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 font-sans dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-blue-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DK</span>
              </div>
              <span className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                Dinas Kesehatan
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#beranda" className="text-blue-800 dark:text-blue-200 hover:text-blue-600 font-medium">
                Beranda
              </a>
              <a href="#profil" className="text-blue-800 dark:text-blue-200 hover:text-blue-600 font-medium">
                Profil
              </a>
              <a href="#layanan" className="text-blue-800 dark:text-blue-200 hover:text-blue-600 font-medium">
                Layanan
              </a>
              <a href="#kontak" className="text-blue-800 dark:text-blue-200 hover:text-blue-600 font-medium">
                Kontak
              </a>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Ajukan Perizinan
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mb-6">
            Dinas Kesehatan
            <span className="block text-blue-600">Bidang PSDK</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Pengawasan Sumber Daya Kesehatan - Melayani masyarakat dalam bidang 
            perizinan dan persuratan kesehatan dengan profesional dan transparan
          </p>
        </div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">
              Profil Bidang PSDK
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
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
          
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Layanan Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Perizinan Tenaga Kesehatan
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Izin Sarana Kesehatan
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Sertifikasi Alat Kesehatan
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Perizinan Praktik Mandiri
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Rekomendasi Penempatan Tenaga Kesehatan
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-gray-700 text-center">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-6">
            Informasi Kontak
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-gray-600 dark:text-gray-300">
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Alamat</h4>
              <p>Jl. Kesehatan No. 123<br />Kota Administrasi</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Telepon</h4>
              <p>(021) 1234-5678</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Email</h4>
              <p>psdk@dinkes.go.id</p>
            </div>
          </div>
        </div>
      </main>

      {/* Form Popup Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-blue-900 dark:text-white">
                  Form Pengajuan Perizinan
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    NIK
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Masukkan NIK"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Perizinan
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                  <option>Pilih jenis perizinan</option>
                  <option>Perizinan Tenaga Kesehatan</option>
                  <option>Izin Sarana Kesehatan</option>
                  <option>Sertifikasi Alat Kesehatan</option>
                  <option>Perizinan Praktik Mandiri</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Berkas Persyaratan
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Pilih Berkas
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PDF, DOC, DOCX maksimal 10MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

