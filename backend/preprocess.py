# preprocess.py
# Module untuk preprocessing gambar sebelum prediksi CNN

from PIL import Image
import numpy as np

# Konfigurasi ukuran input model (MobileNetV2 standard input size)
IMG_HEIGHT = 224
IMG_WIDTH = 224


def preprocess_image(image_path):
    """
    Preprocessing gambar untuk input model CNN MobileNetV2.

    Steps:
        1. Buka gambar dan konversi ke RGB
        2. Resize ke 224x224 pixel
        3. Konversi ke numpy array
        4. Normalize pixel values ke range [0, 1]
        5. Expand dimensions untuk batch dimension

    Args:
        image_path (str): Path ke file gambar yang diupload

    Returns:
        numpy.ndarray: Array yang sudah dipreprocessing, shape (1, 224, 224, 3)
    """
    # Buka gambar dengan Pillow
    img = Image.open(image_path)

    # Konversi ke RGB (menangani RGBA, grayscale, dsb.)
    img = img.convert("RGB")

    # Resize ke ukuran input model (224x224)
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))

    # Konversi ke numpy array
    img_array = np.array(img)

    # Normalize pixel values ke range [0, 1]
    img_array = img_array / 255.0

    # Expand dimensions untuk menambah batch dimension
    # Shape awal: (224, 224, 3) -> Shape akhir: (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array
