const Hospital = require('../models/Hospital');

exports.addHospital = async (req, res) => {
  try {
    const { hospitalName, address, open, close, location, city, description } = req.body;

    if (!hospitalName || !address || !open || !close || !location || !city || !description) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const newHospital = new Hospital({ hospitalName, address, open, close, location, city, description });
    await newHospital.save();

    res.status(201).json({ message: 'Hospital added successfully.' });
  } catch (error) {
    console.error('Error adding hospital:', error);
    res.status(500).json({ message: 'Server error while adding hospital.' });
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ hospitalName: 1 });
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error.message);
    res.status(500).json({ message: 'Failed to fetch hospitals.' });
  }
};
