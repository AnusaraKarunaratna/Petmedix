import React from 'react';
import { FaPaw, FaNotesMedical, FaCalendarCheck, FaBath, FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Pet Registration",
    description: "Easily register your pets and maintain detailed profiles for seamless tracking.",
    icon: <FaPaw size={30} className="text-blue-600" />,
  },
  {
    title: "Medical Records",
    description: "Keep your pet's health history organized with digital vaccination and medical records.",
    icon: <FaNotesMedical size={30} className="text-blue-600" />,
  },
  {
    title: "Appointment Booking",
    description: "Schedule vet visits and grooming sessions without the hassle of phone calls.",
    icon: <FaCalendarCheck size={30} className="text-blue-600" />,
  },
  {
    title: "Grooming Services",
    description: "Pamper your pet with our professional grooming packages tailored to their needs.",
    icon: <FaBath size={30} className="text-blue-600" />,
  },
  {
    title: "Emergency Support",
    description: "Access 24/7 emergency assistance to ensure your pet gets help when needed.",
    icon: <FaPhoneAlt size={30} className="text-blue-600" />,
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">Our Professional Pet Services</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Designed to keep your pet healthy, happy, and well-cared for. Explore what we offer.
        </p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">{service.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <a
            href="/contact"
            className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
          >
            Contact Us for More Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
