import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddElephant = () => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [subspecies, setSubspecies] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [location, setLocation] = useState('');
  const [parents, setParents] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('species', species);
    formData.append('subspecies', subspecies);
    formData.append('birthDate', birthDate);
    formData.append('location', location);
    formData.append('parents', parents);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:5001/api/elephants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Elephant added successfully! ID: ' + response.data.id);
      // Reset form
      setName('');
      setSpecies('');
      setSubspecies('');
      setBirthDate('');
      setLocation('');
      setParents('');
      setImage(null);
    } catch (error) {
      console.error('Error adding elephant:', error);
      toast.error('Failed to add elephant. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-10 text-gray-800">Add New Elephant</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="species">Species</label>
              <input
                type="text"
                id="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="subspecies">Subspecies</label>
              <input
                type="text"
                id="subspecies"
                value={subspecies}
                onChange={(e) => setSubspecies(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="birthDate">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="parents">Parents</label>
              <input
                type="text"
                id="parents"
                value={parents}
                onChange={(e) => setParents(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2" htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full text-center bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600"
            >
              Add Elephant
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddElephant;
