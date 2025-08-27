require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');

// Import routes
const petRoutes = require('./routes/petRoutes');
const tokenGenerator = require('./auth');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');
const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};
app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Serve images from the uploads directory
app.use('/uploads', express.static('uploads'));

// Define API Routes
app.use('/api/pets', petRoutes);
app.use('/api', tokenGenerator);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use("/api/hospitals", hospitalRoutes);

// Proxy route for image prediction
app.post('/api/predict', async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('image', req.body.image); // Assuming image is being sent in the body (adjust if needed)

    // Forward the image to Flask server
    const response = await axios.post('http://localhost:5001/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Send the response from Flask back to the React client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
