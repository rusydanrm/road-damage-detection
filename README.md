# Sistem Deteksi Kerusakan Jalan Menggunakan CNN

Website sederhana untuk mendeteksi kerusakan jalan (retakan dan lubang) menggunakan Convolutional Neural Network berbasis MobileNetV2.

## Fitur

1. **Upload Gambar** - Upload foto jalan untuk dideteksi
2. **AI Detection** - Sistem CNN mendeteksi jenis kerusakan:
   - **Cracks** - Retakan pada jalan (Perlu Perbaikan)
   - **Normal** - Kondisi jalan baik (Aman)
   - **Pothole** - Lubang jalan (Rusak Berat)
3. **Kirim Laporan** - Jika terdeteksi Cracks/Pothole, user dapat mengirim laporan ke Pemerintah Kota Bogor via EmailJS

## Tech Stack

### Frontend
- React + Vite
- Axios (HTTP Client)
- Tailwind CSS
- EmailJS (@emailjs/browser)

### Backend
- Flask
- Flask-CORS
- TensorFlow/Keras (MobileNetV2)
- Pillow (Image Processing)
- NumPy

## Struktur Project

```
road-damage-detection/
|
|-- frontend/                 # React Frontend
|   |-- src/
|   |   |-- components/
|   |   |   |-- Header.jsx
|   |   |   |-- ImageUpload.jsx
|   |   |   |-- DetectionResult.jsx
|   |   |   |-- ReportForm.jsx
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- index.css
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   |-- tailwind.config.js
|   |-- postcss.config.js
|
|-- backend/                  # Flask Backend
|   |-- model/                # Folder untuk file model .h5
|   |   |-- final_road_damage_model.h5
|   |-- uploads/              # Folder untuk menyimpan gambar upload
|   |-- app.py                # Flask app utama
|   |-- predict.py            # Module prediksi
|   |-- preprocess.py         # Module preprocessing gambar
|   |-- labels.py             # Label class dan status
|   |-- requirements.txt      # Dependencies Python
|
|-- README.md
```

## Setup & Cara Menjalankan

### 1. Clone/Extract Project

```bash
cd road-damage-detection
```

### 2. Backend Setup

#### a. Install Python Dependencies

```bash
cd backend

# Buat virtual environment (opsional tapi direkomendasikan)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### b. Tempatkan Model File

Pastikan file model `final_road_damage_model.h5` sudah ditempatkan di:
```
backend/model/final_road_damage_model.h5
```

#### c. Jalankan Flask Server

```bash
python app.py
```

Backend akan berjalan di: `http://localhost:5000`

### 3. Frontend Setup

#### a. Install Node Dependencies

```bash
cd frontend

# Install dependencies
npm install
```

#### b. Setup EmailJS

1. Daftar di [EmailJS](https://www.emailjs.com/)
2. Buat Email Service (Gmail)
3. Buat Email Template
4. Dapatkan Public Key, Service ID, dan Template ID
5. Update konfigurasi di `frontend/src/components/ReportForm.jsx`:

```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: "your_service_id",      // Ganti dengan Service ID Anda
  TEMPLATE_ID: "your_template_id",    // Ganti dengan Template ID Anda
  PUBLIC_KEY: "your_public_key"       // Ganti dengan Public Key Anda
};
```

#### c. Jalankan React Development Server

```bash
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

### 4. Akses Website

Buka browser dan akses: `http://localhost:5173`

---

## Setup EmailJS (Detail)

### Langkah 1: Daftar EmailJS
1. Buka [emailjs.com](https://www.emailjs.com/)
2. Klik "Sign Up" dan buat akun gratis
3. Verifikasi email Anda

### Langkah 2: Tambah Email Service
1. Di dashboard, klik "Email Services"
2. Klik "Add New Service"
3. Pilih "Gmail"
4. Ikuti instruksi untuk menghubungkan akun Gmail
5. Copy **Service ID** (contoh: `service_abc123`)

### Langkah 3: Buat Email Template
1. Klik "Email Templates"
2. Klik "Create New Template"
3. Buat template seperti ini:

**Subject:**
```
[LAPORAN JALAN RUSAK] {{prediction}}
```

**Body:**
```
Yth. Dinas PUPR Kota Bogor,

Diberitahukan bahwa telah diterima laporan kerusakan jalan dengan detail sebagai berikut:

Nama Pelapor: {{reporter_name}}
Lokasi Jalan: {{location}}
Deskripsi Kerusakan: {{description}}

Hasil Deteksi AI:
- Prediction: {{prediction}}
- Confidence: {{confidence}}%
- Status: {{status}}

Timestamp: {{timestamp}}

Lampiran foto jalan telah disertakan bersama email ini.

Terima kasih.
```

4. Simpan dan copy **Template ID** (contoh: `template_xyz456`)

### Langkah 4: Dapatkan Public Key
1. Klik "Account" di sidebar
2. Copy **Public Key** (contoh: `pqr789stuvw`)

### Langkah 5: Update Kode
Update file `ReportForm.jsx` dengan kredensial Anda:

```javascript
const EMAILJS_SERVICE_ID = "service_abc123";     // Ganti
const EMAILJS_TEMPLATE_ID = "template_xyz456";   // Ganti
const EMAILJS_PUBLIC_KEY = "pqr789stuvw";        // Ganti
```

---

## API Endpoint

### POST /predict

Menerima gambar jalan dan mengembalikan hasil deteksi.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (file gambar)

**Response (Sukses):**
```json
{
  "prediction": "Pothole",
  "confidence": 96.4,
  "status": "Rusak Berat",
  "image_path": "abc123.jpg"
}
```

**Response (Error):**
```json
{
  "error": "Pesan error"
}
```

---

## Catatan Penting

1. **Model File**: Pastikan file `final_road_damage_model.h5` sudah ada di folder `backend/model/` sebelum menjalankan backend.

2. **EmailJS**: EmailJS free tier memiliki batas 200 email/bulan. Untuk production, pertimbangkan upgrade plan.

3. **CORS**: Backend sudah dikonfigurasi dengan Flask-CORS untuk mengizinkan request dari frontend.

4. **Ukuran File**: Maksimal ukuran file upload adalah 16MB.

5. **Format Gambar**: Format yang didukung: PNG, JPG, JPEG, WEBP.

---

## Troubleshooting

### Model tidak ditemukan
Pastikan file `final_road_damage_model.h5` sudah ada di `backend/model/`.

### TensorFlow tidak terinstall
```bash
pip install --upgrade tensorflow
```

### CORS Error di browser
Pastikan Flask backend sudah berjalan di port 5000 dan CORS sudah di-enable.

### EmailJS tidak berfungsi
Cek kembali Service ID, Template ID, dan Public Key. Pastikan akun EmailJS sudah terverifikasi.

---

Dibuat untuk project mahasiswa - Sistem Deteksi Kerusakan Jalan CNN
