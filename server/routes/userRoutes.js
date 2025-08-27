const express = require('express');
const { signUp, signIn, verifyUser, logout, updateProfilePicture,getAllUsers } = require('../controllers/userController');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// User Routes
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/logout', logout);

// Route to get all pets
router.get('/get-all-users', getAllUsers);


// Route to update profile picture
router.post('/profile-picture', verifyUser, upload.single('profilePicture'), updateProfilePicture);

// Protected Profile Route
router.get('/profile', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('pets')
      .populate('createdPosts')
      .select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in /profile route:', error.message);
    res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
  }
});

module.exports = router;
