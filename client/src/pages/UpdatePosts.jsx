import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyPosts = () => {
  const [user, setUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
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
        window.location.reload();
      }
    };

    fetchProfile();
  }, [navigate]);

  // Reload logic
  useEffect(() => {
    if (!localStorage.getItem('reloaded')) {
      localStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImage(null);
  };

  const handleUpdatePost = async () => {
    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('content', editContent);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      await axios.put(`http://localhost:5001/api/posts/${editingPost._id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Post updated successfully!');
      setEditingPost(null);
      window.location.reload(); // Reload to reflect the updated post
    } catch (error) {
      console.error(error);
      alert('Failed to update post.');
    }
  };

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
            <div className="mt-4 text-right">
              <button
                onClick={() => handleEdit(post)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Edit Post</h2>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />

            <label className="block mb-2 font-semibold">Content</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              rows="4"
            />

            <label className="block mb-2 font-semibold">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImage(e.target.files[0])}
              className="mb-4"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePost}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
