import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileAndLogout = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users/profile', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("You need to sign in to access this page.");
        navigate('/sign-in');
        window.location.reload(); // Ensure the page reloads when redirected
      }
    };

    fetchProfile();
  }, [navigate]);

  // Refresh page on initial render only once
  useEffect(() => {
    if (!localStorage.getItem('reloaded')) {
      localStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5001/api/users/logout', {}, { withCredentials: true });

      // Cleanup actions on logout
      localStorage.clear(); // Clear all local storage
      console.clear(); // Clear the console
      alert("Logged out successfully");

      navigate('/sign-in'); // Redirect to sign-in
      window.location.reload(); // Refresh the page
    } catch (err) {
      console.error(err);
      alert("Error logging out.");
    }
  };

  // Extract the first letter from the user's email
  const getInitial = (email) => email ? email.charAt(0).toUpperCase() : '';

  // Handle profile picture change
  const handleProfilePictureChange = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const res = await axios.post('http://localhost:5001/api/users/profile-picture', formData, { withCredentials: true });
      alert(res.data.message);

      // Refresh the profile after updating
      const updatedProfile = await axios.get('http://localhost:5001/api/users/profile', { withCredentials: true });
      setUser(updatedProfile.data);
    } catch (err) {
      console.error(err);
      alert("Error updating profile picture.");
    }
  };

  if (!user) return <div className="text-center text-lg mt-4">Loading profile...</div>;

  return (
    <div className="profile-page max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">My Profile</h1>
      <div className="profile-info flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-lg">
        <div className="flex justify-center items-center w-32 h-32 mb-4 relative">
          {user.profilePicture ? (
            <img
              src={`http://localhost:5001${user.profilePicture}?${new Date().getTime()}`}
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-blue-500 object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-white">
              {getInitial(user.email)}
            </div>
          )}
        </div>
        <form onSubmit={handleProfilePictureChange} className="mt-4 text-center">
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
            Update Profile Picture
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-lg font-semibold">
            <span className="text-gray-600">Email:</span> {user.email}
          </p>
          
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg shadow hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileAndLogout;
