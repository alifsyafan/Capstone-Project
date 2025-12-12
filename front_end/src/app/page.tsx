"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Beranda from "@/components/Beranda";
import TentangKami from "@/components/TentangKami";
import Layanan from "@/components/Layanan";
import Kontak from "@/components/Kontak";
import { jenisPerizinanAPI, permohonanAPI, mapJenisPerizinanToFrontend } from "@/lib/api";
import { JenisPerizinan } from "@/types";

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [jenisPerizinanList, setJenisPerizinanList] = useState<JenisPerizinan[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nomorTelepon: "",
    email: "",
    alamat: "",
    jenisPerizinanId: "",
    catatan: "",
  });

  // Fetch jenis perizinan saat modal dibuka
  useEffect(() => {
    if (isFormOpen) {
      fetchJenisPerizinan();
    }
  }, [isFormOpen]);

  const fetchJenisPerizinan = async () => {
    try {
      const response = await jenisPerizinanAPI.getAll(true); // Hanya yang aktif
      if (response.success && response.data) {
        const mapped = response.data.map(mapJenisPerizinanToFrontend);
        setJenisPerizinanList(mapped);
      }
    } catch (error) {
      console.error("Error fetching jenis perizinan:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      namaLengkap: "",
      nomorTelepon: "",
      email: "",
      alamat: "",
      jenisPerizinanId: "",
      catatan: "",
    });
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.namaLengkap || !formData.nomorTelepon || !formData.email || !formData.alamat || !formData.jenisPerizinanId) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Mohon upload minimal 1 berkas persyaratan");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await permohonanAPI.create({
        nama_lengkap: formData.namaLengkap,
        nomor_telepon: formData.nomorTelepon,
        email: formData.email,
        alamat: formData.alamat,
        jenis_perizinan_id: formData.jenisPerizinanId,
        catatan: formData.catatan,
      }, selectedFiles);

      if (response.success) {
        resetForm();
        setIsFormOpen(false);
        setShowSuccessModal(true);
      } else {
        alert("Gagal mengirim permohonan: " + response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-sans">
      <Header onOpenForm={() => setIsFormOpen(true)} />

      <Beranda onOpenForm={() => setIsFormOpen(true)} />

      <TentangKami />

      <Layanan />

      <Kontak />

      {/* Form Popup Modal - IMPROVED VERSION */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn"
          onClick={() => { if (!isSubmitting) { resetForm(); setIsFormOpen(false); } }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Sticky */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-4 sm:py-5 z-10 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                    Form Pengajuan Perizinan
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 mt-1">
                    Dinas Kesehatan
                  </p>
                </div>
                <button
                  onClick={() => { if (!isSubmitting) { resetForm(); setIsFormOpen(false); } }}
                  disabled={isSubmitting}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors disabled:opacity-50"
                  aria-label="Tutup form"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Form Content - Scrollable */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5 sm:py-6">
              <div className="space-y-5 sm:space-y-6">
                
                {/* Data Diri Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Data Diri
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaLengkap"
                        value={formData.namaLengkap}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Telepon/WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="nomorTelepon"
                          value={formData.nomorTelepon}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all"
                          placeholder="089xxxxxxxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all"
                          placeholder="contoh@gmail.com"
                        />
                      </div>
                    </div>

                    {/* Alamat */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all resize-none"
                        rows={3}
                        placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Kelurahan, Kecamatan, Kota)"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Perizinan Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-green-100">
                  <h4 className="text-base sm:text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Informasi Perizinan
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Jenis Perizinan */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Perizinan <span className="text-red-500">*</span>
                      </label>
                      <select 
                        name="jenisPerizinanId"
                        value={formData.jenisPerizinanId}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all bg-white"
                      >
                        <option value="">Pilih jenis perizinan</option>
                        {jenisPerizinanList.map((jp) => (
                          <option key={jp.id} value={jp.id}>{jp.nama}</option>
                        ))}
                      </select>
                    </div>

                    {/* Upload Berkas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Berkas Persyaratan <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-5 sm:p-6 text-center transition-colors bg-white">
                        <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-3 sm:mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base inline-flex items-center shadow-md">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Pilih Berkas
                          </label>
                          <input 
                            id="file-upload" 
                            ref={fileInputRef}
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            multiple 
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                          PDF, DOC, DOCX (Maksimal 10MB per file)
                        </p>
                      </div>
                      
                      {/* List File yang dipilih */}
                      {selectedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Berkas terpilih:</p>
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Catatan */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catatan Tambahan (Opsional)
                      </label>
                      <textarea
                        name="catatan"
                        value={formData.catatan}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all resize-none"
                        rows={3}
                        placeholder="Tambahkan catatan atau informasi tambahan jika diperlukan"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                      Pastikan semua data yang diisi sudah benar. Proses verifikasi akan dilakukan dalam 2-3 hari kerja setelah pengajuan diterima.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer - Sticky */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                <p className="text-xs text-gray-500 text-center sm:text-left">
                  <span className="text-red-500">*</span> Wajib diisi
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setIsFormOpen(false); }}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all text-sm sm:text-base shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Kirim Pengajuan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-slideUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Permohonan Berhasil Dikirim!</h3>
              <p className="text-gray-600 mb-6">Terima kasih telah mengajukan permohonan. Kami akan segera memproses dan menghubungi Anda melalui email.</p>
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