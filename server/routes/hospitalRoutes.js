const express = require('express');
const router = express.Router();
const { addHospital,getAllHospitals } = require('../controllers/hospitalController');

router.post('/add-hospital', addHospital);
router.get('/', getAllHospitals);

module.exports = router;
