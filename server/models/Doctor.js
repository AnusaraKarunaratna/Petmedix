const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  isAvailable: { type: Boolean, default: false },
  timeFrom: { type: String },
  timeTo: { type: String },
}, { _id: false });

const weeklyAvailabilitySchema = new mongoose.Schema({
  Monday: { type: availabilitySchema, default: () => ({}) },
  Tuesday: { type: availabilitySchema, default: () => ({}) },
  Wednesday: { type: availabilitySchema, default: () => ({}) },
  Thursday: { type: availabilitySchema, default: () => ({}) },
  Friday: { type: availabilitySchema, default: () => ({}) },
  Saturday: { type: availabilitySchema, default: () => ({}) },
  Sunday: { type: availabilitySchema, default: () => ({}) },
}, { _id: false });

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mapUrl: { type: String, required: true },
  availability: { type: weeklyAvailabilitySchema, required: true },
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });



const doctorSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  occupation: { type: String, required: true },
  description: { type: String, required: true },
  checkupMode: {
    type: String,
    enum: ["online", "physical", "both"],
    required: true,
  },
  coverImage: { type: String },
  profileImage: { type: String },
  clinicImage: { type: String },
  password: { type: String},
  places: { type: [placeSchema], required: true },
  whyChoose: { type: [String], required: true },
  contactInfo: {
    gmail: { type: String, required: true },
    contactNumbers: { type: [String], required: true },
  },
  
  onlineReservations: [
    {
      title: String,
      description: String,
      time: Date,
      meetingLink: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emailSent: Boolean,
    }
  ],

  PhysicalReservations: [
    {
      title: String,
      description: String,
      time: Date,
      location: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emailSent: Boolean,
    }
  ],

  ebook: [
    {
      title: String,
      description: String,
      seal: Date,
      location: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emailSent: Boolean,
    }
  ],

  bookedDateTimes: [
    {
      time: Date,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ],

  paymentDetails: {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bank: { type: String, required: true },
    branch: { type: String, required: true },
  },
  feedbacks: { type: [feedbackSchema], default: [] }
}, {
  timestamps: true,
});



const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
