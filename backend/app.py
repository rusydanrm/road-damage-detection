# app.py
# Flask Backend API untuk Sistem Deteksi Kerusakan Jalan CNN

import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from predict import predict_image

# Inisialisasi Flask app
app = Flask(__name__)

# Enable CORS agar frontend React dapat mengakses API
CORS(app)

# Konfigurasi folder upload
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Konfigurasi ekstensi file yang diizinkan
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# Maksimal ukuran file upload (16 MB)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024


def allowed_file(filename):
    """
    Cek apakah ekstensi file diizinkan.

    Args:
        filename (str): Nama file yang diupload

    Returns:
        bool: True jika ekstensi diizinkan, False jika tidak
    """
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def index():
    """
    Root endpoint untuk cek status API.
    """
    return jsonify({
        "message": "Road Damage Detection API",
        "status": "running",
        "endpoints": {
            "predict": "POST /predict - Upload gambar untuk deteksi kerusakan jalan"
        }
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Endpoint untuk menerima upload gambar dan melakukan prediksi.

    Method: POST
    Content-Type: multipart/form-data
    Field: image (file)

    Returns:
        JSON: Hasil prediksi dengan prediction, confidence, dan status
    """
    # Cek apakah ada file yang diupload
    if "image" not in request.files:
        return jsonify({"error": "Tidak ada file gambar yang diupload"}), 400

    file = request.files["image"]

    # Cek apakah file memiliki nama
    if file.filename == "":
        return jsonify({"error": "Nama file kosong"}), 400

    # Cek ekstensi file dan proses
    if file and allowed_file(file.filename):
        # Generate nama file unik untuk menghindari konflik
        ext = file.filename.rsplit(".", 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)

        # Simpan file ke folder uploads
        file.save(filepath)

        try:
            # Lakukan prediksi
            result = predict_image(filepath)

            # Simpan path gambar untuk referensi
            result["image_path"] = unique_filename

            # Return hasil prediksi
            return jsonify(result), 200

        except FileNotFoundError as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": f"Terjadi kesalahan saat prediksi: {str(e)}"}), 500

    else:
        return jsonify({
            "error": "Format file tidak didukung. Gunakan: png, jpg, jpeg, webp"
        }), 400


@app.route("/upload-image", methods=["POST"])
def upload_image():
    """
    Endpoint untuk mengunggah gambar laporan ke backend.
    """
    if "image" not in request.files:
        return jsonify({"error": "Tidak ada file gambar yang diupload"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Nama file kosong"}), 400

    if file and allowed_file(file.filename):
        ext = file.filename.rsplit(".", 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)

        file.save(filepath)

        image_url = request.host_url.rstrip('/') + f"/uploads/{unique_filename}"
        return jsonify({
            "filename": unique_filename,
            "url": image_url
        }), 200

    return jsonify({"error": "Format file tidak didukung. Gunakan: png, jpg, jpeg, webp"}), 400


@app.route("/uploads/<filename>", methods=["GET"])
def get_uploaded_image(filename):
    """
    Endpoint untuk mengakses gambar yang diupload.
    Berguna untuk menampilkan gambar attachment di email.
    """
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# Error handler untuk file terlalu besar
@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File terlalu besar. Maksimal 16MB"}), 413


if __name__ == "__main__":
    # Jalankan Flask server
    # Debug=True untuk development, matikan saat production
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
