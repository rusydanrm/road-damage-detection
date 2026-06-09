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
          Sistem Pelaporan Kerusakan Jalan Bogor
        </h1>

        {/* Deskripsi Singkat */}
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Website berbasis computer vision untuk membantu masyarakat melaporkan kerusakan jalan
          dan trotoar di wilayah Kota Bogor dan Kabupaten Bogor secara lebih mudah, cepat, dan terarah.
        </p>
      </div>
    </header>
  );
}

export default Header;
