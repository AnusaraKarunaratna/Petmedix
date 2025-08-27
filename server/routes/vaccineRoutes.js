const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccineController');
const { verifyUser } = require('../controllers/userController');

// Route to add vaccine
router.post('/vaccine', verifyUser, vaccineController.addVaccine);

// Route to fetch vaccines for the current user
router.get('/vaccine', verifyUser, vaccineController.getUserVaccines);


module.exports = router; 
