const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  petName: String,
  vaccineName: String,
  lastVaccinationDate: Date,
  nextVaccinationDate: Date,
  reminderPeriodDays: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Vaccine', vaccineSchema);
