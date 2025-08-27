import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HandThumbUpIcon as HandThumbUpOutline } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/react/24/solid';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activeComments, setActiveComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users/profile', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        alert("You need to sign in to access this page.");
        navigate('/sign-in');
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching posts.');
        setLoading(false);
      }
    };

    fetchPosts();
    fetchProfile();
  }, [navigate]);

  const toggleComments = (postId) => {
    setActiveComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/posts/${postId}/like`,
        {},
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      alert('Error liking the post. Ensure you are logged in.');
    }
  };

  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleCommentSubmit = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        alert('User not found. Please sign in.');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const email = parsedUser?.email;

      if (!email) {
        alert('User email not found. Please sign in.');
        return;
      }

      const response = await axios.post(
        `http://localhost:5001/api/posts/${postId}/comment`,
        {
          text: newComment,
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, response.data.comment] }
            : post
        )
      );
      setNewComment('');
    } catch (error) {
      alert('Error submitting comment.');
    }
  };

  if (loading) return <div className="text-center text-blue-500 mt-10">Loading posts...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 rounded-2xl shadow-lg transition hover:shadow-xl duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">
                {post.user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-800">{post.user?.email || 'Unknown User'}</p>
                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-blue-900 mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-3">{post.content}</p>

            {post.image ? (
              <img
                src={`http://localhost:5001${post.image}`}
                alt="Post"
                className="w-full h-auto rounded-lg object-cover mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                No Image Available
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-600">
              <p>{post.likes.length || 0} Likes</p>
              <p>{post.comments?.length || 0} Comments</p>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                onClick={() => handleLike(post._id)}
              >
                {post.likes.includes(user?._id) ? (
                  <>
                    <HandThumbUpSolid className="w-5 h-5 text-blue-600" />
                    Liked
                  </>
                ) : (
                  <>
                    <HandThumbUpOutline className="w-5 h-5 text-gray-500" />
                    Like
                  </>
                )}
              </button>

              <button
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => toggleComments(post._id)}
              >
                {activeComments[post._id] ? 'Hide Comments' : 'View Comments'}
              </button>
            </div>

            {activeComments[post._id] && (
              <div className="mt-6 border-t pt-4 space-y-3">
                {post.comments?.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment._id}>
                      <p className="text-sm font-bold text-gray-700">{comment.username || 'Anonymous'}</p>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No comments yet.</p>
                )}

                <div className="mt-4">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows="3"
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Write your comment here..."
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="mt-2 bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 transition"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
