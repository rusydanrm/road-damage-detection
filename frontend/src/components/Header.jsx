/**
 * Header.jsx
 * Section 1 - Header website
 * Menampilkan judul dan deskripsi singkat project
 */

import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-[#355872] to-[#7AAACE] text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        {/* Judul Utama */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Sistem Deteksi Kerusakan Jalan & Trotoar
        </h1>

        {/* Deskripsi Singkat */}
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Sistem untuk mendeteksi kerusakan jalan dan trotoar seperti retakan atau lubang
          menggunakan Convolutional Neural Network.
        </p>
      </div>
    </header>
  );
}

export default Header;
