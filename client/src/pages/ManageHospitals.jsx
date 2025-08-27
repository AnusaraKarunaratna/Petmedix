import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaPlusCircle, FaCalendarAlt } from 'react-icons/fa';

const ManageHospitals = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'View Hospitals',
      description: 'Check deatils of hospitals already registered with the system.',
      icon: <FaEye className="text-4xl text-blue-500 mb-4" />,
      navigateTo: '/display-hospital',
    },
    {
      title: 'Add Hospitals',
      description: 'Add a new hospital to the system',
      icon: <FaPlusCircle className="text-4xl text-green-500 mb-4" />,
      navigateTo: '/add-hospital',
    },
    {
      title: 'Update Hospital Details',
      description: 'Modify and update hospital details',
      icon: <FaCalendarAlt className="text-4xl text-yellow-500 mb-4" />,
      navigateTo: '/update-post',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
        Manage Hospitals
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.navigateTo)}
            className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer hover:shadow-2xl hover:scale-105 transition duration-300"
          >
            {card.icon}
            <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
            <p className="text-gray-600 text-sm mt-2">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageHospitals;