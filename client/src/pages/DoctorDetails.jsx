import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/doctors/list');
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (id, name) => {
    navigate(`/doctor-profile/${id}?name=${encodeURIComponent(name)}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="container mx-auto mt-10 px-4 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Meet Our Expert Doctors</h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or occupation..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              onClick={() => handleDoctorClick(doctor._id, doctor.doctorName)}
              className="bg-white hover:shadow-xl transition-shadow duration-300 shadow-md rounded-2xl p-5 flex flex-col items-center cursor-pointer hover:scale-105 transform ease-in-out"
            >
              {doctor.profileImage && (
                <img
                  src={doctor.profileImage}
                  alt={doctor.doctorName}
                  className="w-28 h-28 object-cover rounded-full border-2 border-blue-300 mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-center text-gray-800">{doctor.doctorName}</h2>
              <p className="text-sm text-gray-500 mb-1">{doctor.occupation}</p>
              <p className="text-sm text-blue-500">{doctor.gmail}</p>
              

              {/* Rating */}
              <div className="flex mt-2">{renderStars(doctor.rating || 4)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
