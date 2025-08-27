// routes/vendorRoutes.js
const express = require('express');
const { registerVendor } = require('../controllers/vendorController');
const router = express.Router();

router.post('/register', registerVendor);

module.exports = router;
