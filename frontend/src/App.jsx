/**
 * App.jsx
 * Main App Component untuk Sistem Deteksi Kerusakan Jalan CNN
 * Menggabungkan Header dan ImageUpload section
 */

import React from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <Header />

      {/* Deteksi Gambar Section */}
      <ImageUpload />

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">
            Sistem Deteksi Kerusakan Jalan CNN
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
