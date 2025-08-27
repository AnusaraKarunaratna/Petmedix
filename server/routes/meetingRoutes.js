const express = require('express');
const { createMeeting, getMeetings } = require('../controllers/meetingController');
const { verifyUser } = require('../controllers/userController');

const router = express.Router();

router.post('/create',verifyUser, createMeeting);
router.get('/view',verifyUser, getMeetings);          
       

module.exports = router;
