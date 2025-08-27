import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyPosts = () => {
  const [user, setUser] = useState(null);
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

  

  if (!user) return <div className="text-center text-lg mt-4">Loading profile...</div>;

  return (
    <div className="profile-page max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">My Profile</h1>
      <h2 className="text-2xl font-bold text-blue-600 mt-8">Your Posts</h2>
      <div className="posts-container mt-4 grid grid-cols-1 gap-6">
        {user.createdPosts.map(post => (
          <div key={post._id} className="post bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 mb-4">
            <h3 className="text-xl font-semibold text-blue-500">{post.title}</h3>
            <p className="text-gray-700 mt-2">{post.content}</p>
            {post.image && (
              <div className="mt-4 flex justify-center">
                <img
                  src={`http://localhost:5001${post.image}`}
                  alt={post.title}
                  className="max-w-full max-h-40 object-contain rounded-lg shadow"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
