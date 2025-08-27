const User = require('../models/User');
const Vaccine = require('../models/Vaccine');

exports.addVaccine = async (req, res) => {
    try {
        const { petName, vaccineName, lastVaccinationDate, nextVaccinationDate, reminderPeriodDays } = req.body;

        if (!petName || !vaccineName || !lastVaccinationDate || !nextVaccinationDate || !reminderPeriodDays) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        const vaccine = new Vaccine({
            petName,
            vaccineName,
            lastVaccinationDate,
            nextVaccinationDate,
            reminderPeriodDays,
            user: req.user.id,
        });

        const savedVaccine = await vaccine.save();

        await User.findByIdAndUpdate(
          req.user.id,
          { $push: { vaccines: savedVaccine._id } },
          { new: true, useFindAndModify: false }
        );

        res.status(201).json({ message: 'Pet registered successfully!', vaccine : savedVaccine });
    } catch (error) {
        console.error('Error registering pet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Fetch vaccines for current user
exports.getUserVaccines = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated.' });
      }
  
      const vaccines = await Vaccine.find({ user: req.user.id }).sort({ nextVaccinationDate: 1 });
  
      res.status(200).json(vaccines);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
