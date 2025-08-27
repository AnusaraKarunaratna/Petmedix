import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo and Description */}
        <div>
          <h1 className="text-3xl font-extrabold mb-4 tracking-wide">PETMEDIX</h1>
          <p className="text-gray-200">
            Empowering smarter pet care with advanced solutions. Your companion’s health, just a click away.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-blue-300 transition duration-200">Home</a></li>
            <li><a href="/about" className="hover:text-blue-300 transition duration-200">About</a></li>
            <li><a href="/services" className="hover:text-blue-300 transition duration-200">Services</a></li>
            <li><a href="/contact" className="hover:text-blue-300 transition duration-200">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p>📍 123 Wellness Ave, PetCity, Colombo</p>
          <p>📞 +94 71 334 7781</p>
          <p>✉️ support@petmedix.com</p>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4 ml-10">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300 transition duration-300 text-2xl ml-9"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-300 transition duration-300 text-2xl"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-300 transition duration-300 text-2xl"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-300 transition duration-300 text-2xl"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-gray-200">
        &copy; {new Date().getFullYear()} PETMEDIX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
