const express = require('express');
const multer = require('multer');
const path = require('path');
const { createPost, getPosts, likePost, unlikePost, addComment, deleteComment,updatePost,getAllPosts } = require('../controllers/postController');
const { verifyUser } = require('../controllers/userController');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Create a post with image upload (protected route)
router.post('/', verifyUser, upload.single('image'), createPost);

// Get all posts (public route)
router.get('/', getPosts);

// Get all posts (public route)
router.get('/get-all-posts', getAllPosts);

router.post('/:id/like', verifyUser, likePost);
router.post('/:id/unlike', verifyUser, unlikePost);
router.post('/:id/comment', verifyUser, addComment);
router.delete('/:postId/comment/:commentId', verifyUser, deleteComment);
router.put('/:id', verifyUser, upload.single('image'), updatePost);



module.exports = router;
