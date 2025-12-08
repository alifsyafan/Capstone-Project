"use client";

import { useState } from "react";
import { JenisPerizinan } from "@/types";

interface KelolaPerizinanProps {
  jenisPerizinanList: JenisPerizinan[];
  onTambah: (perizinan: Omit<JenisPerizinan, 'id' | 'createdAt'>) => void;
  onEdit: (perizinan: JenisPerizinan) => void;
  onHapus: (id: string) => void;
}

export default function KelolaPerizinan({ jenisPerizinanList, onTambah, onEdit, onHapus }: KelolaPerizinanProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingPerizinan, setEditingPerizinan] = useState<JenisPerizinan | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    persyaratan: [""],
    aktif: true,
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      nama: "",
      deskripsi: "",
      persyaratan: [""],
      aktif: true,
    });
    setEditingPerizinan(null);
  };

  const handleOpenModal = (perizinan?: JenisPerizinan) => {
    if (perizinan) {
      setEditingPerizinan(perizinan);
      setFormData({
        nama: perizinan.nama,
        deskripsi: perizinan.deskripsi,
        persyaratan: perizinan.persyaratan.length > 0 ? perizinan.persyaratan : [""],
        aktif: perizinan.aktif,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleAddPersyaratan = () => {
    setFormData({
      ...formData,
      persyaratan: [...formData.persyaratan, ""],
    });
  };

  const handleRemovePersyaratan = (index: number) => {
    const newPersyaratan = formData.persyaratan.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      persyaratan: newPersyaratan.length > 0 ? newPersyaratan : [""],
    });
  };

  const handlePersyaratanChange = (index: number, value: string) => {
    const newPersyaratan = [...formData.persyaratan];
    newPersyaratan[index] = value;
    setFormData({ ...formData, persyaratan: newPersyaratan });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama.trim()) {
      alert("Nama perizinan wajib diisi");
      return;
    }

    const persyaratanFiltered = formData.persyaratan.filter(p => p.trim() !== "");

    if (editingPerizinan) {
      onEdit({
        ...editingPerizinan,
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        persyaratan: persyaratanFiltered,
        aktif: formData.aktif,
      });
    } else {
      onTambah({
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        persyaratan: persyaratanFiltered,
        aktif: formData.aktif,
      });
    }

    handleCloseModal();
  };

  const handleToggleAktif = (perizinan: JenisPerizinan) => {
    onEdit({
      ...perizinan,
      aktif: !perizinan.aktif,
    });
  };

  const handleDelete = (id: string) => {
    onHapus(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Jenis Perizinan</h2>
          <p className="text-gray-500">Tambah, edit, atau hapus jenis perizinan yang tersedia</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambah Perizinan</span>
        </button>
      </div>

      {/* Daftar Perizinan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jenisPerizinanList.map((perizinan) => (
          <div
            key={perizinan.id}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
              perizinan.aktif ? 'border-gray-200' : 'border-gray-300 opacity-60'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">{perizinan.nama}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      perizinan.aktif 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {perizinan.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{perizinan.deskripsi}</p>
                </div>
              </div>

              {perizinan.persyaratan.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Persyaratan:</p>
                  <ul className="space-y-1">
                    {perizinan.persyaratan.map((syarat, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {syarat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(perizinan)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setConfirmDelete(perizinan.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => handleToggleAktif(perizinan)}
                  className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                    perizinan.aktif
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {perizinan.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {jenisPerizinanList.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 mb-4">Belum ada jenis perizinan</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah Perizinan Pertama</span>
          </button>
        </div>
      )}

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-blue-600 text-white">
              <h3 className="text-lg font-bold">
                {editingPerizinan ? 'Edit Jenis Perizinan' : 'Tambah Jenis Perizinan Baru'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Perizinan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Contoh: Izin Penelitian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
                    placeholder="Deskripsi singkat tentang jenis perizinan ini"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Persyaratan
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPersyaratan}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Tambah Persyaratan
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.persyaratan.map((syarat, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={syarat}
                          onChange={(e) => handlePersyaratanChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder={`Persyaratan ${index + 1}`}
                        />
                        {formData.persyaratan.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePersyaratan(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="aktif"
                    checked={formData.aktif}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="aktif" className="text-sm text-gray-700">
                    Aktifkan perizinan ini (tampil di form pengajuan)
                  </label>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingPerizinan ? 'Simpan Perubahan' : 'Tambah Perizinan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Perizinan?</h3>
              <p className="text-gray-500 mb-6">
                Apakah Anda yakin ingin menghapus jenis perizinan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
