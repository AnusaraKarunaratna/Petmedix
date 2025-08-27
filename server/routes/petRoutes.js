const express = require('express');
const router = express.Router();
const multer = require('multer');
const petController = require('../controllers/petController');
const { verifyUser } = require('../controllers/userController');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Create a pet with image upload (protected route)
router.post('/register', verifyUser, upload.single('image'), petController.registerPet);

// Route to get all pets
router.get('/', petController.getPets);

// Route to get a single pet by ID
router.get('/:id', petController.getPetById);

// Route to delete a pet by ID
router.delete('/:id', petController.deletePet);

router.post('/add-record', verifyUser, petController.createMedicalRecord);

router.get('/records/:petTitle', verifyUser, petController.getGrowthRecords);


module.exports = router;
