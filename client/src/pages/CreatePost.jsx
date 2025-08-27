import React, { useState } from 'react';
import axios from 'axios';


const PostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('http://localhost:5001/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            setSuccessMessage('Post created successfully!');
            setTitle('');
            setContent('');
            setImage(null);
            console.log('Post response:', response.data);
        } catch (error) {
            console.error('Error creating post:', error.response?.data || error.message);
            setErrorMessage('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-lg">
            <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                Create a Post
            </h2>
            {successMessage && (
                <div className="mb-4 p-3 text-green-700 bg-green-100 rounded border border-green-400">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 text-red-700 bg-red-100 rounded border border-red-400">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Enter post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
                <textarea
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
                <div className="flex items-center space-x-3">
                    <label
                        htmlFor="fileInput"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
                    >
                        Upload Image
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="hidden"
                    />
                    {image && (
                        <span className="text-gray-700">{image.name}</span>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-bold ${
                        loading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>
    );
};

export default PostForm;
