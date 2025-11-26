"use client";

import { useState } from "react";
import Image from "next/image";

interface HeaderProps {
  onOpenForm: () => void;
}

export default function Header({ onOpenForm }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-blue-100 z-50">
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
            <button onClick={() => scrollToSection('beranda')} className="text-blue-800 hover:text-blue-600 font-medium">
              Beranda
            </button>
            <button onClick={() => scrollToSection('profil')} className="text-blue-800 hover:text-blue-600 font-medium">
              Tentang Kami
            </button>
            <button onClick={() => scrollToSection('layanan')} className="text-blue-800 hover:text-blue-600 font-medium">
              Layanan
            </button>
            <button onClick={() => scrollToSection('kontak')} className="text-blue-800 hover:text-blue-600 font-medium">
              Kontak
            </button>
          </div>
          
          {/* Desktop Button */}
          <button
            onClick={onOpenForm}
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
            <button
              onClick={() => {
                scrollToSection('beranda');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-blue-800 hover:text-blue-600 font-medium py-2"
            >
              Beranda
            </button>
            <button
              onClick={() => {
                scrollToSection('profil');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-blue-800 hover:text-blue-600 font-medium py-2"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => {
                scrollToSection('layanan');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-blue-800 hover:text-blue-600 font-medium py-2"
            >
              Layanan
            </button>
            <button
              onClick={() => {
                scrollToSection('kontak');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-blue-800 hover:text-blue-600 font-medium py-2"
            >
              Kontak
            </button>
            <button
              onClick={() => {
                onOpenForm();
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
  );
}
