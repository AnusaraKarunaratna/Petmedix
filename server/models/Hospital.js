const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  address: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Hospital', hospitalSchema);
