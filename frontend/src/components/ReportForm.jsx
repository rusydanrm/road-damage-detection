/**
 * ReportForm.jsx
 * Form untuk mengirim laporan kerusakan jalan ke Pemerintah Kota Bogor
 * Menggunakan EmailJS untuk pengiriman email
 * 
 * Email tujuan: dpupr@kotabogor.go.id
 * Email pengirim: jalanrusakvkc@gmail.com
 */

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

// ====================================================================
// KONFIGURASI EMAILJS
// Ganti nilai di bawah ini dengan kredensial EmailJS Anda
// Cara mendapatkan: daftar di https://www.emailjs.com/
// ====================================================================
const EMAILJS_SERVICE_ID = 'service_jalan';    // Ganti dengan Service ID Anda
const EMAILJS_TEMPLATE_ID = 'template_7g27nbm';  // Ganti dengan Template ID Anda
const EMAILJS_PUBLIC_KEY = 'Hr2hjMs9l5HkMbBUz'; // Ganti dengan Public Key Anda

// Email tujuan laporan (Pemerintah Kota Bogor)
const EMAIL_TO = 'dpupr@kotabogor.go.id';
const API_URL = 'https://road-damage-detection-production-682b.up.railway.app';

function ReportForm({ prediction, confidence, status, imageFile, previewUrl }) {
  // State untuk form
  const [reporterName, setReporterName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // State untuk status pengiriman
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Ref untuk form
  const formRef = useRef(null);

  useEffect(() => {
    if (!formRef.current) return;

    const reporterNameField = formRef.current.querySelector('input[name="reporter_name"]');
    const locationField = formRef.current.querySelector('input[name="location"]');
    const descriptionField = formRef.current.querySelector('textarea[name="description"]');

    if (reporterNameField) reporterNameField.value = reporterName;
    if (locationField) locationField.value = location;
    if (descriptionField) descriptionField.value = description;
  }, [reporterName, location, description]);

  useEffect(() => {
    if (!formRef.current) return;
    const imageUrlField = formRef.current.querySelector('input[name="image_url"]');
    if (imageUrlField) imageUrlField.value = uploadedImageUrl;
  }, [uploadedImageUrl]);

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;
    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append('file', imageFile);

      formData.append(
        'upload_preset',
        'jalan-rusak'
      );

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dmlogbjun/image/upload',
        formData
      );

      return response.data.secure_url;

    } catch (err) {
      console.error(err);
      setUploadError('Upload gambar gagal');

      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Handle submit form laporan
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!reporterName.trim()) {
      setSendResult({ type: 'error', message: 'Nama pelapor wajib diisi' });
      return;
    }
    if (!location.trim()) {
      setSendResult({ type: 'error', message: 'Lokasi jalan wajib diisi' });
      return;
    }
    if (!description.trim()) {
      setSendResult({ type: 'error', message: 'Deskripsi kerusakan wajib diisi' });
      return;
    }

    // Cek apakah konfigurasi EmailJS sudah diupdate
    if (EMAILJS_SERVICE_ID === 'service_xxxxxx') {
      setSendResult({
        type: 'error',
        message: 'EmailJS belum dikonfigurasi. Silakan update Service ID, Template ID, dan Public Key di file ReportForm.jsx'
      });
      return;
    }

    setSending(true);
    setSendResult(null);

    let imageUrl = uploadedImageUrl;
    if (imageFile && !uploadedImageUrl) {
      imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        setSending(false);
        setSendResult({ type: 'error', message: 'Gagal mengunggah gambar ke backend.' });
        return;
      }

      const imageUrlField = formRef.current.querySelector('input[name="image_url"]');
      if (imageUrlField) {
        imageUrlField.value = imageUrl;
      }

      setUploadedImageUrl(imageUrl);
    }

    console.log('Form data sebelum submit:', {
      reporter_name: reporterName,
      location: location,
      description: description,
      prediction: prediction,
      confidence: `${confidence}%`,
      status: status,
      image_url: uploadedImageUrl || imageUrl
    });

    const templateParams = {
      to_email: EMAIL_TO,
      subject: `[LAPORAN JALAN RUSAK] ${prediction}`,
      reporter_name: reporterName,
      location: location,
      description: description,
      prediction: prediction,
      confidence: `${confidence}%`,
      status: status,
      timestamp: new Date().toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      image_url: uploadedImageUrl || imageUrl
    };

    console.log('Template params:', templateParams);

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('Email berhasil dikirim:', response);
      setSendResult({
        type: 'success',
        message: 'Laporan berhasil dikirim ke Pemerintah Kota Bogor!'
      });

      // Reset form setelah berhasil
      setReporterName('');
      setLocation('');
      setDescription('');

    } catch (error) {
      console.error('Error mengirim email:', error);
      setSendResult({
        type: 'error',
        message: `Gagal mengirim laporan: ${error.text || error.message || 'Unknown error'}`
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header Form */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">📧</div>
        <h3 className="text-xl font-bold text-slate-800">
          Kirim Laporan ke Pemerintah Kota Bogor
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Email akan dikirim ke: <span className="font-medium">{EMAIL_TO}</span>
        </p>
      </div>

      {/* Status Hasil Pengiriman */}
      {sendResult && (
        <div
          className={`mb-6 p-4 rounded-lg text-center ${
            sendResult.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {sendResult.type === 'success' ? '✅' : '⚠️'} {sendResult.message}
        </div>
      )}

      {/* Form Laporan */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="to_email" value={EMAIL_TO} />
        <input type="hidden" name="subject" value={`[LAPORAN JALAN RUSAK] ${prediction}`} />
        <input type="hidden" name="prediction" value={prediction} />
        <input type="hidden" name="confidence" value={`${confidence}%`} />
        <input type="hidden" name="status" value={status} />
        <input type="hidden" name="timestamp" value={new Date().toLocaleString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })} />
        <input type="hidden" name="image_url" value={uploadedImageUrl} />

        {/* Nama Pelapor */}
        <div>
          <label htmlFor="reporterName" className="block text-sm font-medium text-slate-700 mb-1">
            Nama Pelapor <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reporterName"
            name="reporter_name"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="Masukkan nama Anda"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            disabled={sending}
          />
        </div>

        {/* Lokasi Jalan */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
            Lokasi Jalan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Jalan Pajajaran, Bogor Tengah"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            disabled={sending}
          />
        </div>

        {/* Deskripsi Kerusakan */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Deskripsi Kerusakan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Jelaskan kondisi kerusakan jalan..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
            disabled={sending}
          />
        </div>

        {/* Tombol Kirim */}
        <button
          type="submit"
          disabled={sending}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center justify-center gap-2"
        >
          {sending ? (
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
              Mengirim Laporan...
            </>
          ) : (
            <>
              Kirim Laporan ke Pemda
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
