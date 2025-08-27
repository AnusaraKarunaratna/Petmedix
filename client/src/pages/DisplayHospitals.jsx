import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Hospital,
  MapPin,
  Clock,
  Info,
  Landmark,
  X,
  Search
} from 'lucide-react';
import cover from '../assets/hospital.png';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((hospital) =>
    (hospital.hospitalName + hospital.city + hospital.location)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto mt-12">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">
        🏥 Registered Hospitals
      </h2>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by name, city, or location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredHospitals.length === 0 ? (
        <p className="text-gray-600 text-center">No matching hospitals found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 p-5 transition-transform transform hover:-translate-y-1 cursor-pointer group"
              onClick={() => setSelectedHospital(hospital)}
            >
              <img
                src={cover}
                alt="Hospital"
                className="w-full h-44 object-cover rounded-xl mb-4"
              />

              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-blue-700">
                    <Hospital size={20} />
                    <h3 className="text-xl font-bold line-clamp-1">
                      {hospital.hospitalName}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <Landmark size={16} /> {hospital.address}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <MapPin size={16} /> {hospital.city}, {hospital.location}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <Clock size={16} /> {hospital.open} - {hospital.close}
                  </p>

                  <p className="text-sm text-gray-600 mt-3 flex gap-2 line-clamp-3">
                    <Info size={16} className="mt-0.5" />
                    {hospital.description}
                  </p>
                </div>

                {hospital.description.length > 100 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHospital(hospital);
                    }}
                    className="mt-3 text-sm text-blue-600 hover:underline self-start"
                  >
                    Learn More
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔍 Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-auto backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-8 relative animate-fade-in-down">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              onClick={() => setSelectedHospital(null)}
            >
              <X size={24} />
            </button>

            <img
              src={cover}
              alt="Hospital"
              className="w-full h-52 object-cover rounded-2xl mb-6"
            />

            <h3 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Hospital size={24} /> {selectedHospital.hospitalName}
            </h3>

            <p className="text-gray-700 mb-1 flex items-center gap-2">
              <Landmark size={18} /> {selectedHospital.address}
            </p>
            <p className="text-gray-700 mb-1 flex items-center gap-2">
              <MapPin size={18} /> {selectedHospital.city}, {selectedHospital.location}
            </p>
            <p className="text-gray-700 mb-1 flex items-center gap-2">
              <Clock size={18} /> Open: {selectedHospital.open} — Close: {selectedHospital.close}
            </p>
            <p className="text-gray-700 mt-4 flex items-start gap-2">
              <Info size={18} className="mt-1" />
              <span>{selectedHospital.description}</span>
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHospital.address + ', ' + selectedHospital.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-700 underline text-sm hover:text-blue-900"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalList;
