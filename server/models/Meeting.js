const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    time: { type: Date, required: true },
    meetingLink: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, 
});

module.exports = mongoose.model('Meeting', meetingSchema);
