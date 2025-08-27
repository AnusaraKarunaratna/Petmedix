const express = require('express');
const twilio = require('twilio');

const router = express.Router();

// Generate a Twilio Access Token for a user
router.post('/token', (req, res) => {
    const { room } = req.body;
    const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const API_KEY = process.env.TWILIO_API_KEY;
    const API_SECRET = process.env.TWILIO_API_SECRET;
    const identity = `user_${Math.floor(Math.random() * 1000)}`; // Random identity for each user

    // Create a Twilio Access Token
    const token = new twilio.jwt.AccessToken(
        ACCOUNT_SID,
        API_KEY,
        API_SECRET,
        { identity: identity }
    );

    // Add Video Grant
    const videoGrant = new twilio.jwt.VideoGrant({ room: room });
    token.addGrant(videoGrant);

    // Serialize the token as a JWT
    const jwtToken = token.toJwt();

    // Send the token to the client
    res.json({ token: jwtToken });
});

module.exports = router;
