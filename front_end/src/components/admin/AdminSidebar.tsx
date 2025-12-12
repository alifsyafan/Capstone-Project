"use client";

import Image from "next/image";
import { useEffect } from "react";

interface AdminSidebarProps {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  jumlahPermohonanBaru: number;
}

export default function AdminSidebar({ activeMenu, onMenuClick, isOpen, onToggle, jumlahPermohonanBaru }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "permohonan-baru", label: "Permohonan Baru", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", badge: jumlahPermohonanBaru > 0 ? jumlahPermohonanBaru : undefined },
    { id: "permohonan-diproses", label: "Sedang Diproses", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "riwayat", label: "Riwayat", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "semua-permohonan", label: "Semua Permohonan", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
    { id: "kelola-perizinan", label: "Kelola Perizinan", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  // Handle menu click - close sidebar on mobile
  const handleMenuClick = (menuId: string) => {
    onMenuClick(menuId);
    // Close sidebar on mobile when menu is clicked
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        onToggle();
      }
    };
    
    // Close on initial load if mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768 && isOpen) {
      onToggle();
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onToggle}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 z-50 
        ${isOpen ? 'w-64 translate-x-0' : 'md:w-20 w-64 -translate-x-full md:translate-x-0'}`}>
        {/* Logo / Toggle Button */}
        <div className={`flex items-center p-4 border-b border-blue-700 ${isOpen ? 'justify-between' : 'md:justify-center justify-between'}`}>
          {/* Show logo and text when open */}
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo-kotamakassar.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-sm">Admin Panel</h1>
                <p className="text-xs text-blue-200">Dinas Kesehatan</p>
              </div>
            </div>
          )}
          
          {/* Toggle button - always visible */}
          <button
            onClick={onToggle}
            className={`text-white hover:bg-blue-700 rounded-lg p-2 transition-colors ${!isOpen ? 'md:w-12 md:h-12 md:flex md:items-center md:justify-center' : ''}`}
            title={isOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
                activeMenu === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className={`text-sm font-medium ${isOpen ? 'block' : 'hidden md:hidden'}`}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`absolute ${isOpen ? 'right-4' : 'md:top-1 md:right-1 right-4'} bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className={`absolute bottom-4 left-4 right-4 ${isOpen ? 'block' : 'hidden md:hidden'}`}>
          <a
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Kembali ke Website</span>
          </a>
        </div>
      </aside>
    </>
  );
}
