const Post = require('../models/Post');
const path = require('path');
const User = require('../models/User');

// Create a post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required.' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        // Create and save the post with the user ID
        const post = new Post({
            title,
            content,
            image: imagePath,
            user: req.user.id, // Save the user ID
        });

        const savedPost = await post.save();

        // Update user's createdPosts array
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { createdPosts: savedPost._id } }, // Add the post ID to the createdPosts array
            { new: true, useFindAndModify: false }
        );

        res.status(201).json({ message: 'Post created successfully!', post: savedPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', 'email'); // Populate user email

        // Map over posts to include image URLs
        const postsWithImages = posts.map((post) => ({
            ...post._doc,
            imageUrl: post.image ? `http://localhost:5001${post.image}` : null, // Prefix with the base URL
        }));

        res.status(200).json(postsWithImages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
    }
};

// Toggle Like (Like or Dislike)
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found.' });

        const likedIndex = post.likes.indexOf(userId);

        if (likedIndex !== -1) {
            // User already liked — remove (dislike)
            post.likes.splice(likedIndex, 1);
        } else {
            // Not liked yet — add (like)
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({ message: 'Post like status updated!', likes: post.likes });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};


// Unlike a post
exports.unlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: 'Post not found.' });

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ error: 'User has not liked this post.' });
        }

        post.likes = post.likes.filter((id) => id.toString() !== userId);
        await post.save();

        res.status(200).json({ message: 'Post unliked successfully!', likes: post.likes });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

// Add a comment
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { email } = req.body;
        const postId = req.params.id;

        if (!text) return res.status(400).json({ error: 'Comment text is required.' });

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: 'Post not found.' });

        if (post.comments.some((comment) => comment.username.toString() === email)) {
            return res.status(400).json({ error: 'User has already commented on this post.' });
        }

        post.comments.push({ username: email, text });
        await post.save();

        res.status(200).json({ message: 'Comment added successfully!', comments: post.comments });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: 'Post not found.' });

        const comment = post.comments.find(
            (comment) => comment._id.toString() === commentId && comment.user.toString() === userId
        );

        if (!comment) {
            return res.status(400).json({ error: 'Comment not found or user not authorized.' });
        }

        post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully!', comments: post.comments });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const { title, content } = req.body;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
      const post = await Post.findById(postId);
  
      if (!post) return res.status(404).json({ error: 'Post not found.' });
      if (post.user.toString() !== req.user.id)
        return res.status(403).json({ error: 'Unauthorized to update this post.' });
  
      post.title = title || post.title;
      post.content = content || post.content;
      if (imagePath) post.image = imagePath;
  
      const updatedPost = await post.save();
      res.status(200).json({ message: 'Post updated successfully.', post: updatedPost });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ data: posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts.' });
    }
};
  