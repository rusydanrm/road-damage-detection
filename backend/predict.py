# predict.py
# Module untuk loading model dan melakukan prediksi

import os
import numpy as np
import tensorflow as tf
import tensorflow_model_optimization as tfmot
from keras.layers import Dense as KerasDense
from keras.models import load_model
from preprocess import preprocess_image
from labels import CLASS_NAMES, CLASS_STATUS

# Path ke file model .h5
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "final_road_damage_model.h5")

# Global variable untuk menyimpan model (lazy loading)
_model = None


class DenseWithQuantization(KerasDense):
    def __init__(self, *args, quantization_config=None, **kwargs):
        super().__init__(*args, **kwargs)


def get_model():

    global _model

    if _model is None:

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model file tidak ditemukan di: {MODEL_PATH}"
            )

        print("Loading model...")

        _model = load_model(
            MODEL_PATH,
            compile=False,
            custom_objects={"Dense": DenseWithQuantization},
        )

        print("Model berhasil diload!")

    return _model

def predict_image(image_path):
    """
    Melakukan prediksi pada gambar jalan yang diupload.

    Args:
        image_path (str): Path ke file gambar yang diupload

    Returns:
        dict: Hasil prediksi dengan format:
            {
                "prediction": str,    # Nama class (Cracks/Normal/Pothole)
                "confidence": float,  # Confidence score dalam persen
                "status": str         # Status kondisi jalan
            }
    """
    # Preprocessing gambar
    preprocessed_img = preprocess_image(image_path)

    # Load model
    model = get_model()

    # Prediksi
    predictions = model.predict(preprocessed_img, verbose=0)

    # Ambil class dengan confidence tertinggi
    predicted_class = int(np.argmax(predictions[0]))
    confidence = float(np.max(predictions[0])) * 100  # Konversi ke persen

    # Format hasil
    result = {
        "prediction": CLASS_NAMES[predicted_class],
        "confidence": round(confidence, 2),
        "status": CLASS_STATUS[predicted_class]
    }

    return result
