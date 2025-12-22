"use client";

import { Notifikasi, AdminRole } from "@/types";

interface AdminHeaderProps {
  notifikasi: Notifikasi[];
  showNotifikasi: boolean;
  onToggleNotifikasi: () => void;
  onBacaNotifikasi: (notifId: string) => void;
  onLihatPermohonan: (permohonanId: string) => void;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  adminName?: string;
  adminRole?: AdminRole;
}

export default function AdminHeader({ 
  notifikasi, 
  showNotifikasi, 
  onToggleNotifikasi, 
  onBacaNotifikasi,
  onLihatPermohonan,
  onLogout,
  onToggleSidebar,
  adminName = "Admin",
  adminRole = "admin"
}: AdminHeaderProps) {
  const notifikasiBelumDibaca = notifikasi.filter(n => !n.dibaca).length;

  const formatTanggal = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        {/* Mobile Hamburger + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger button for mobile */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {/* Title */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Panel Admin</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Dinas Kesehatan Kota Makassar</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifikasi */}
          <div className="relative">
            <button
              onClick={onToggleNotifikasi}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Notifikasi"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifikasiBelumDibaca > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {notifikasiBelumDibaca > 9 ? '9+' : notifikasiBelumDibaca}
                </span>
              )}
            </button>

            {/* Dropdown Notifikasi */}
            {showNotifikasi && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Notifikasi</h3>
                  <p className="text-xs text-gray-500">{notifikasiBelumDibaca} notifikasi belum dibaca</p>
                </div>
                <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                  {notifikasi.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm">Tidak ada notifikasi</p>
                    </div>
                  ) : (
                    notifikasi.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          onBacaNotifikasi(notif.id);
                          onLihatPermohonan(notif.permohonanId);
                        }}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                          !notif.dibaca ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.dibaca ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs sm:text-sm ${!notif.dibaca ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                              {notif.pesan}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{formatTanggal(notif.tanggal)}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1 sm:mx-2"></div>

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800 leading-tight">{adminName}</p>
              <p className="text-xs text-gray-500">{adminRole === "super_admin" ? "Super Admin" : "Administrator"}</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Keluar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
