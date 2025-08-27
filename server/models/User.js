const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }], 
  vaccines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine' }],
  onlineReservations: [
    {
      title: String,
      description: String,
      time: Date,
      meetingLink: String,
      doctor: String,
      emailSent: Boolean,
    }
  ],

  PhysicalReservations: [
    {
      title: String,
      description: String,
      time: Date,
      location: String,
      doctor : String,
      emailSent: Boolean,
    }
  ],

  bookedDateTimes: [
    {
      time: Date,
      doctor : String
    }
  ],
  profilePicture: { type: String }, 
  createdPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
});

module.exports = mongoose.model('User', userSchema);
