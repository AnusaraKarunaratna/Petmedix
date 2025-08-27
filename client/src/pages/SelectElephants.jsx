import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookElephants = () => {
  const [elephants, setElephants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

  useEffect(() => {
    const fetchElephants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/fetch-elephants'); // Adjust the URL as needed
        setElephants(response.data);
      } catch (err) {
        setError('Failed to fetch elephants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchElephants();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl); 
  };

  const closeModal = () => {
    setSelectedImage(null); 
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Attractive Header */}
      <div className="bg-yellow-500 py-8">
        <h1 className="text-5xl font-bold text-center text-white mb-2 drop-shadow-lg">Book Elephants</h1>
        <p className="text-lg text-center text-black mb-1">Discover and learn more about these magnificent creatures!</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elephants.map(elephant => (
            <div key={elephant.id} className="bg-white shadow-lg rounded-lg p-6 text-center mt-10">
              <h2 className="text-2xl font-bold mb-2">{elephant.name}</h2>
              {elephant.imageUrl && (
                <img
                  src={elephant.imageUrl}
                  alt={elephant.name}
                  className="w-full h-50 object-cover rounded-lg cursor-pointer"
                  onClick={() => openModal(elephant.imageUrl)} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying full image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative">
            <img src={selectedImage} alt="Full elephant" className="max-w-full max-h-screen" />
            <button
              className="absolute top-0 right-0 p-2 text-white"
              onClick={closeModal}
            >
              &times; 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookElephants;
