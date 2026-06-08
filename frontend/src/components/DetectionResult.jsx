/**
 * DetectionResult.jsx
 * Menampilkan hasil prediksi dari model CNN
 * - Prediction (Cracks/Normal/Pothole)
 * - Confidence Score
 * - Status Jalan
 */

import React from 'react';

function DetectionResult({ result }) {
  // Tentukan warna berdasarkan prediksi
  const getStatusColor = (prediction) => {
    switch (prediction) {
      case 'Cracks':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-800',
          badge: 'bg-yellow-500',
          icon: '⚠️'
        };
      case 'Normal':
        return {
          bg: 'bg-green-50',
          border: 'border-green-300',
          text: 'text-green-800',
          badge: 'bg-green-500',
          icon: '✅'
        };
      case 'Pothole':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-800',
          badge: 'bg-red-500',
          icon: '🚨'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-800',
          badge: 'bg-gray-500',
          icon: '❓'
        };
    }
  };

  const colors = getStatusColor(result.prediction);

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 mb-8`}>
      {/* Judul Hasil */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{colors.icon}</div>
        <h3 className={`text-xl font-bold ${colors.text}`}>
          Hasil Deteksi
        </h3>
      </div>

      {/* Detail Hasil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prediction */}
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Prediction</p>
          <p className={`text-2xl font-bold ${colors.text}`}>
            {result.prediction}
          </p>
        </div>

        {/* Confidence Score */}
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Confidence Score</p>
          <p className="text-2xl font-bold text-blue-700">
            {result.confidence}%
          </p>
        </div>

        {/* Status Jalan */}
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Status Jalan</p>
          <p className={`text-lg font-bold ${colors.text}`}>
            {result.status}
          </p>
        </div>
      </div>

      {/* Progress bar confidence */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-slate-600 mb-1">
          <span>Tingkat Kepercayaan</span>
          <span>{result.confidence}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${colors.badge}`}
            style={{ width: `${result.confidence}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default DetectionResult;
