import React, { useState } from 'react';
import axios from 'axios';

const ImageClassifier = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      setResult({ error: 'Prediction failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">Disease Classifier</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full" />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-auto rounded-lg border border-gray-300"
        />
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        disabled={!image || loading}
      >
        {loading ? 'Predicting...' : 'Predict'}
      </button>

      {result && (
        <div className="mt-4 text-center">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <div>
              <p className="text-lg font-semibold">Prediction: {result.class}</p>
              <p className="text-gray-600">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;
