const Pet = require('../models/Pet');
const User = require('../models/User');

exports.registerPet = async (req, res) => {
    try {
        const { title, species,gender, breed, birthdate, content } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !species || !breed || !birthdate || !content) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        const pet = new Pet({
            title,
            species,
            gender,
            breed,
            birthdate,
            content,
            image: imagePath,
            user: req.user.id,
        });

        const savedPet = await pet.save();

        await User.findByIdAndUpdate(
          req.user.id,
          { $push: { pets: savedPet._id } },
          { new: true, useFindAndModify: false }
        );

        res.status(201).json({ message: 'Pet registered successfully!', pet: savedPet });
    } catch (error) {
        console.error('Error registering pet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPets = async (req, res) => {
    try {
        const pets = await Pet.find();
        res.status(200).json({ data: pets });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Failed to fetch pets.' });
    }
};

exports.getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found.' });
        }
        res.status(200).json({ data: pet });
    } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({ message: 'Failed to fetch pet.' });
    }
};

exports.deletePet = async (req, res) => {
    try {
        const deletedPet = await Pet.findByIdAndDelete(req.params.id);
        if (!deletedPet) {
            return res.status(404).json({ message: 'Pet not found.' });
        }
        res.status(200).json({ message: 'Pet deleted successfully.', data: deletedPet });
    } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ message: 'Failed to delete pet.' });
    }
};


exports.createMedicalRecord = async (req, res) => {
    try {
      const { weight, height, date, pet} = req.body;
  
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated.' });
      }
  
      const petRecord = await Pet.findOne({ title: pet });

  
      if (!petRecord) {
        return res.status(404).json({ error: 'Pet not found.' });
      }
  
  
      const newRecord = {
        weight,
        height,
        date
      };
  
      // Initialize arrays if undefined in Doctor
      if (!petRecord.growth) petRecord.growth = [];
  
      petRecord.growth.push(newRecord);
  
      await petRecord.save();

      res.status(201).json({ success: true, record: newRecord });
    } catch (error) {
      console.error('Error creating record :', error);
      res.status(500).json({ success: false, error: error.message });
    }
  };


  exports.getGrowthRecords = async (req, res) => {
    try {
      const { petTitle } = req.params;
  
      const pet = await Pet.findOne({ title: petTitle });
  
      if (!pet) {
        return res.status(404).json({ error: 'Pet not found.' });
      }
  
      res.status(200).json({ growth: pet.growth || [] });
    } catch (error) {
      console.error('Error fetching growth records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  