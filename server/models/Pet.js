const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    title: { type: String, required: true },
    species: { type: String, required: true },
    gender: { type: String, required: true },
    breed: { type: String, required: true },
    birthdate: { type: Date, required: true },
    content: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    weight: { type: Number },
    height: { type: Number },
    color: { type: String },
    vaccinationStatus: { type: String },
    medicalHistory: { type: String },

    currentMedications: { type: String },
    isNeutered: { type: Boolean },
    feedingSchedule: { type: String },
    foodType: { type: String },
    allergies: { type: String },
    exerciseRoutine: { type: String },
    activityLevel: { type: String },

    growth: [
        {
          weight: Number,
          height: Number,
          date: Date,
        }
      ],
});

module.exports = mongoose.model('Pet', petSchema);
