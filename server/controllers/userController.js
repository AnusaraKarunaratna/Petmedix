const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const multer = require('multer');

// User Sign-Up
exports.signUp = async (req, res) => {
  const { email, password, pets, profilePicture } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, pets, profilePicture });
    await user.save();

    // Automatically sign in the user after registration
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, pets: user.pets, profilePicture: user.profilePicture },
    });
  } catch (error) {
    console.error('Sign-up Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Sign-In
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 });

    res.status(200).json({
      message: 'Sign-in successful',
      user: { id: user._id, email: user.email, pets: user.pets, profilePicture: user.profilePicture },
    });
  } catch (error) {
    console.error('Sign-in Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify User Middleware
exports.verifyUser = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'Strict' });
  res.status(200).json({ message: 'Successfully logged out' });
};

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Controller to handle profile picture update
exports.updateProfilePicture = async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        // Update user's profile picture
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture: imagePath },
            { new: true, useFindAndModify: false }
        );

        res.status(200).json({ message: 'Profile picture updated successfully!', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find();
      res.status(200).json({ data: users });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users.' });
  }
};