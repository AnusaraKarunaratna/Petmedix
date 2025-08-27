// routes/ticketRoutes.js
const express = require('express');
const { releaseTickets } = require('../controllers/ticketController');
const router = express.Router();

router.post('/release-tickets', (req, res) => {
    const { maxTickets, ticketsPerRelease, interval } = req.body;

    if (!maxTickets || !ticketsPerRelease || !interval) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    releaseTickets(maxTickets, ticketsPerRelease, interval);
    res.status(200).json({ message: 'Ticket release process started' });
});

module.exports = router;
