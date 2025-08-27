import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/PetMedixLogo.png';
import { UserIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
    };

    window.addEventListener('storage', handleStorageChange);

    // Fetch user data on initial render
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      console.log(`User email: ${storedUser.email}`);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn()) {
      navigate('/profile');
    } else {
      navigate('/sign-in');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem('authToken');
  };

  const getUserInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : '';
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-black p-5 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/">
            <img src={Logo} alt="Brand Logo" className="h-12 w-auto" />
          </a>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
        <div className={`flex-1 md:flex md:items-center md:justify-end space-y-4 md:space-y-0 ${isOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8 mt-2">
            <li>
              <a href="/" className="text-gray-300 hover:text-blue-200 text-base font-bold px-3 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Home
              </a>
            </li>
            <li>
              <a href="/services" className="text-gray-300 hover:text-blue-200 text-base font-bold px-3 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Services
              </a>
            </li>
            <li>
              <a href="/dashboard" className="text-gray-300 hover:text-blue-200 text-base font-bold px-3 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-300 hover:text-blue-200 text-base font-bold px-3 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Contact
              </a>
            </li>
            <li className="flex items-center">
              {isLoggedIn() ? (
                <>
                  <div onClick={() => navigate('/profile')} className="cursor-pointer bg-gray-300 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full">
                    {user && getUserInitial(user.email)}
                  </div>
                </>
              ) : (
                <button onClick={handleUserIconClick} className="text-gray-300 hover:text-gray-200 text-base font-bold rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center">
                  <UserIcon className="w-6 h-6" />
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
