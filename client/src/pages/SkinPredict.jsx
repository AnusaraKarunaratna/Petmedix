import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, UploadCloud, ImagePlus, Dog } from 'lucide-react';

const PredictionPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction('');
      setRecommendations(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5002/predict', formData);
      setPrediction(response.data.prediction);
      setRecommendations(response.data.recommendations || null);
    } catch (error) {
      console.error(error);
      setPrediction('Prediction failed.');
      setRecommendations(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white px-4 py-10 flex items-center justify-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 space-y-8 transition-all duration-300">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700 flex justify-center items-center gap-2">
            <Dog className="w-8 h-8 text-blue-600" />
            Dog Skin Condition Predictor
          </h1>
          <p className="text-gray-500 text-sm mt-2">Upload an image to get a diagnosis and treatment plan</p>
        </div>

        <div className="relative">
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition duration-300"
          >
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <UploadCloud className="w-10 h-10 text-blue-500" />
            <p className="text-blue-600 mt-2 text-sm font-medium">
              {image ? 'Change Image' : 'Click to upload image'}
            </p>
          </label>
        </div>

        {preview && (
          <div className="w-full h-full rounded-xl overflow-hidden shadow-md border">
            <img src={preview} alt="Preview" className="w-100 h-full object-cover" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!image || loading}
          className={`w-full py-3 rounded-xl text-white text-lg font-semibold shadow-md transition-all ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              Processing...
            </div>
          ) : (
            'Predict Now'
          )}
        </button>

        {prediction && (
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-300 shadow-inner">
            <p className="text-sm text-gray-500 mb-1">Prediction Result</p>
            <p className="text-2xl font-bold text-blue-800">{prediction}</p>
          </div>
        )}

        {recommendations && (
          <div className="bg-white rounded-xl border shadow-md p-6 space-y-4">
            <h3 className="text-xl font-semibold text-blue-800 border-b pb-2">🩺 Care Recommendations</h3>

            <div>
              <strong className="text-blue-700">🍽️ Foods to Eat</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {recommendations.foods.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong className="text-blue-700">🧴 Recommended Creams</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {recommendations.creams.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong className="text-blue-700">🛁 Shampoos</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {recommendations.shampoo.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong className="text-blue-700">📋 Care Instructions</strong>
              <p className="mt-1 text-gray-800">{recommendations.instructions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
