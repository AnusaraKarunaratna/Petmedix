import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from "react-slick";

import Cover1 from '../assets/pet1.jpg';
import Cover2 from '../assets/pet2.jpg';
import Cover3 from '../assets/pet3.jpg';
import AboutImage from '../assets/pet-about.jpg';
import Gallery1 from '../assets/pet-gallery1.jpg';
import Gallery2 from '../assets/pet-gallery2.jpg';
import Gallery3 from '../assets/pet-gallery3.jpg';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const PetManagementHomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/skin-predict');
  };

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    pauseOnHover: false,
  };

  return (
    <div className="bg-gray-100 font-sans">
      {/* Hero Carousel */}
      <section className="relative h-screen">
        <Slider {...sliderSettings}>
          {[Cover1, Cover2, Cover3].map((img, i) => (
            <div key={i} className="h-screen">
              <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}>
                <div className="h-full bg-black bg-opacity-50 flex items-center justify-center text-white px-4 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <h1 className="text-5xl font-extrabold mb-4">Welcome to PETMDEIX</h1>
                    <p className="text-lg mb-6">Smart & Loving Pet Management System</p>
                    <button
                      onClick={handleNavigation}
                      className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                    >
                      Get Started
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img src={AboutImage} alt="About Pets" className="rounded-xl shadow-2xl" />
          </motion.div>
          <motion.div
            className="md:w-1/2 mt-10 md:mt-0 md:pl-10"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-blue-700">Your Pet, Our Priority</h2>
            <p className="text-gray-700 text-lg mb-6">
              PetCare+ helps manage your pets' records, appointments, vaccinations, grooming schedules and more—all in one smart platform.
            </p>
            <button
              onClick={handleNavigation}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-full shadow-md transition"
            >
              Manage Your Pet
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats / Features */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-blue-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ['Pets Registered', '450+'],
              ['Appointments Tracked', '1200+'],
              ['Vets Connected', '85'],
            ].map(([title, stat], i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                <p className="text-5xl text-blue-600 mt-4">{stat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Pet Moments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[Gallery1, Gallery2, Gallery3].map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt={`Gallery ${i + 1}`}
                className="rounded-xl w-full h-72 object-cover shadow-lg hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-100 text-center">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Care Better?
        </motion.h2>
        <p className="text-lg mb-6 text-gray-700">Join hundreds of pet lovers using PETMDEIX today!</p>
        <button
          onClick={handleNavigation}
          className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
        >
          Manage Now
        </button>
      </section>
    </div>
  );
};

export default PetManagementHomePage;
