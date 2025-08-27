import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHospitalAlt, FaCity, FaMapMarkerAlt, FaClock, FaAlignLeft } from 'react-icons/fa';

const AddHospital = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [address, setAddress] = useState('');
  const [open, setOpen] = useState('');
  const [close, setClose] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hospitalName || !address || !open || !close || !location || !city || !description) {
      toast.error('Please fill in all fields!');
      return;
    }

    const formData = {
      hospitalName,
      address,
      open,
      close,
      location,
      city,
      description,
    };

    try {
      await axios.post('http://localhost:5001/api/hospitals/add-hospital', formData);
      toast.success('Hospital added successfully!');
      setHospitalName('');
      setAddress('');
      setOpen('');
      setClose('');
      setLocation('');
      setCity('');
      setDescription('');
    } catch (error) {
      toast.error('Error adding hospital.');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 shadow-2xl rounded-3xl animate-fadeIn">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">🩺 Add New Hospital</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2">
          <FaHospitalAlt className="text-blue-600" />
          <input
            type="text"
            placeholder="Hospital Name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-600" />
            <input
              type="time"
              placeholder="Opening Time"
              value={open}
              onChange={(e) => setOpen(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-red-600" />
            <input
              type="time"
              placeholder="Closing Time"
              value={close}
              onChange={(e) => setClose(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaCity className="text-blue-600" />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex items-start gap-2">
          <FaAlignLeft className="text-blue-600 mt-2" />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-300"
        >
          🚀 Add Hospital
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddHospital;
