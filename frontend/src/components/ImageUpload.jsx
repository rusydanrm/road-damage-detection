/**
 * ImageUpload.jsx
 * Section 2 - Deteksi Gambar
 * Fitur: Upload gambar, preview, deteksi, dan tampil hasil
 */

import React, { useState, useRef } from 'react';
import axios from 'axios';
import DetectionResult from './DetectionResult';
import ReportForm from './ReportForm';

// Konfigurasi API URL
// Ganti ini jika backend berjalan di URL berbeda
const API_URL = 'https://road-damage-detection-production-682b.up.railway.app';

function ImageUpload() {
  // State untuk mengelola file dan preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // State untuk hasil deteksi
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk memilih sumber gambar saat klik drop zone
  const [showSourceOptions, setShowSourceOptions] = useState(false);
  const [captureSource, setCaptureSource] = useState('gallery');

  // Ref untuk input file (hidden)
  const fileInputRef = useRef(null);

  /**
   * Handle saat user memilih file dari file picker
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  /**
   * Process file yang dipilih/drop
   */
  const processFile = (file) => {
    // Reset state
    setResult(null);
    setError(null);

    // Validasi tipe file
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan: PNG, JPG, JPEG, atau WEBP');
      return;
    }

    // Validasi ukuran file (maks 16MB)
    if (file.size > 16 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 16MB');
      return;
    }

    setSelectedFile(file);

    // Buat URL preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  /**
   * Handle drag and drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDropZoneClick = () => {
    setError(null);
    setShowSourceOptions(true);
  };

  const handleReplaceImage = () => {
    setError(null);
    setShowSourceOptions(true);
  };

  const handleSourceSelect = (source) => {
    setCaptureSource(source);
    setShowSourceOptions(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handle tombol "Deteksi" diklik
   */
  const handleDetect = async () => {
    if (!selectedFile) {
      setError('Pilih gambar terlebih dahulu');
      return;
    }

    // Reset error dan set loading
    setError(null);
    setLoading(true);
    setResult(null);

    // Buat FormData untuk upload
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Kirim request ke Flask API
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Simpan hasil prediksi
      setResult(response.data);
    } catch (err) {
      console.error('Error saat prediksi:', err);
      setError(
        err.response?.data?.error || 'Terjadi kesalahan saat melakukan prediksi. Pastikan backend sudah berjalan.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle hapus gambar dan reset
   */
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setLoading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cleanup object URL saat unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      {/* Judul Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Upload Gambar
        </h2>
        <p className="text-slate-600">
          Upload foto jalan atau trotoar untuk mendeteksi kerusakan secara otomatis
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        {/* Drop Zone */}
        {!previewUrl ? (
          <div
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-5xl mb-4">📁</div>
            <p className="text-lg font-medium text-slate-700 mb-2">
              Klik di sini untuk pilih sumber gambar
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Atau tarik dan lepas gambar langsung ke area ini
            </p>
            {showSourceOptions ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSourceSelect('gallery');
                  }}
                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Ambil Foto Kamera
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSourceSelect('camera');
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ambil dari Galeri
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Format: PNG, JPG, JPEG, WEBP (Maks. 16MB)
              </p>
            )}
          </div>
        ) : (
          /* Preview Gambar */
          <div className="text-center">
            <img
              src={previewUrl}
              alt="Preview gambar jalan"
              className="max-h-80 mx-auto rounded-lg shadow-md object-contain"
            />
            <p className="text-sm text-slate-500 mt-3">
              {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            {showSourceOptions && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSourceSelect('camera');
                  }}
                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Ambil Foto Kamera
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSourceSelect('gallery');
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ambil dari Galeri
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={captureSource === 'camera' ? 'environment' : undefined}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {previewUrl && (
            <button
              onClick={handleReplaceImage}
              className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Ganti Gambar
            </button>
          )}

          {previewUrl && (
            <button
              onClick={handleDetect}
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  {/* Loading Spinner */}
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  Deteksi
                </>
              )}
            </button>
          )}

          {(previewUrl || result) && (
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Hasil Deteksi */}
      {result && (
        <DetectionResult result={result} />
      )}

      {/* Form Laporan (muncul jika hasil Cracks atau Pothole) */}
      {result && (result.prediction === 'Cracks' || result.prediction === 'Pothole') && (
        <ReportForm
          prediction={result.prediction}
          confidence={result.confidence}
          status={result.status}
          imageFile={selectedFile}
          previewUrl={previewUrl}
        />
      )}
    </section>
  );
}

export default ImageUpload;
