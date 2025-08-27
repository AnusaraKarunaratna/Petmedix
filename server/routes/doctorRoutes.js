const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const doctorController = require('../controllers/doctorController');
const { verifyUser } = require('../controllers/userController');

// Ensure the upload folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post(
  '/register',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'clinicImage', maxCount: 1 },
  ]),
  doctorController.registerDoctor
);

router.get('/list', doctorController.getDoctors);
router.post('/reserve', verifyUser, doctorController.createOnlineReservation);
router.get('/saved-meetings', verifyUser, doctorController.getSavedMeetings);

//To get all online sessions realted to doctor
router.get('/online-meetings', doctorController.getOnlineMeetingsByDoctorName);

router.post('/feedback/:id', doctorController.addFeedback);
router.post('/physical-reserve', verifyUser, doctorController.createPhysicalReservation);

//To get all physical sessions realted to user
router.get('/saved-physical-meetings', verifyUser, doctorController.getSavedPhysicalMeetings);

//To get all physical sessions realted to doctor
router.get('/physical-meetings', doctorController.getPhysicalMeetingsByDoctorName);

router.get('/physical-locations', doctorController.getPhysicalMeetingsLocationsByDoctorName);

// Route to get all pets
router.get('/get-all-doctors', doctorController.getAllDoctors);

router.get('/:id', doctorController.getDoctorById);



module.exports = router;


