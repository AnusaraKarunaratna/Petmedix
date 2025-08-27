import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import location from '../assets/map.webp';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [rating, setRating] = useState(1);
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/doctors/${doctorId}`);
        setDoctor(response.data);
        setSubmittedFeedbacks(response.data.feedbacks || []);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Failed to fetch doctor details. Please try again later.');
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const getImageUrl = (imageName) => {
    return imageName ? `http://localhost:5001/uploads/${imageName}` : '';
  };

  const handleBookAppointment = () => {
    navigate(`/book-session?doctor=${doctor.doctorName}`);
  };

  const handleBookPhysicalAppointment = () => {
    navigate(`/physical-session?doctor=${doctor.doctorName}`);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      name: 'Anonymous User', // Ideally, fetch user's name from the auth system
      message: feedbackMessage,
      rating: rating,
    };

    // Submit feedback to the backend
    axios.post(`http://localhost:5001/api/doctors//feedback/${doctorId}`, newFeedback)
      .then(response => {
        // Update the local state with the new feedback
        setSubmittedFeedbacks([...submittedFeedbacks, response.data]);
        setFeedbackMessage('');
        setRating(1);
      })
      .catch(error => {
        console.error('Error submitting feedback:', error);
      });
  };

  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      {doctor ? (
        <div className="bg-white rounded shadow-lg">
          {/* Name and Title */}
          <div className="text-center p-6 bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">{doctor.doctorName}</h1>
            <p className="text-lg text-gray-600 mt-2">{doctor.occupation}</p>
            <button
              onClick={handleBookAppointment}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Book Online Appointment
            </button>
            <button
              onClick={handleBookPhysicalAppointment}
              className="mt-4 px-4 ml-10 py-2 bg-blue-500 text-white rounded"
            >
              Book Physical Appointment
            </button>
          </div>

          {/* Cover Image */}
          <div>
            <img
              src={getImageUrl(doctor.coverImage)}
              alt="Cover"
              className="w-full h-full object-cover rounded-t"
            />
          </div>

          {/* Main Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 p-6 rounded shadow">
                <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Availability Schedule</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctor.places.map((place, idx) => (
                    <div key={idx} className="bg-blue-100 border border-blue-300 rounded-xl p-4 shadow hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-blue-800 mb-1">{place.name}</h3>
                      <div className="space-y-2">
                        {Object.entries(place.availability).map(([day, details]) => {
                          if (!details.isAvailable) return null; // Skip if not available

                          return (
                            <div key={day} className="text-sm text-blue-700">
                              <strong>{day}:</strong> {details.timeFrom} - {details.timeTo}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="bg-gray-50 p-4 rounded shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Locations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctor.places.map((place, index) => (
                    <div key={index} className="bg-white p-4 rounded shadow">
                      <p className="font-bold text-gray-700">{place.name}</p>
                      <iframe
                        src={location}
                        title={`Map for ${place.name}`}
                        className="w-full h-40 mt-2 rounded shadow"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-gray-50 p-6 rounded shadow">
                <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Feedback</h2>
                <div className="space-y-4">
                  {submittedFeedbacks.map((feedback, index) => (
                    <div key={index} className="bg-white p-4 rounded shadow mb-4">
                      <p className="text-gray-700 font-semibold">{feedback.name}</p>
                      <p className="text-gray-600">{feedback.message}</p>
                      <p className="text-yellow-500">
                        {'★'.repeat(feedback.rating)}{' '}
                        {'☆'.repeat(5 - feedback.rating)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Form */}
              <div className="bg-gray-50 p-6 rounded shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Leave a Feedback</h3>
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Your Feedback</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Rating</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                          {star} Star{star > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded"
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              {/* Profile Image */}
              <div>
                <img
                  src={getImageUrl(doctor.profileImage)}
                  alt="Profile"
                  className="w-full h-full object-cover rounded shadow"
                />
              </div>

              {/* Why Choose */}
              <div className="bg-gray-50 p-4 rounded shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Why Choose</h2>
                <ul className="list-disc pl-6 text-gray-700">
                  {doctor.whyChoose.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>

              {/* Clinic Image */}
              <div>
                <img
                  src={getImageUrl(doctor.clinicImage)}
                  alt="Clinic"
                  className="w-full h-64 object-cover rounded shadow"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">Loading...</div>
      )}
    </div>
  );
};

export default DoctorProfile;
