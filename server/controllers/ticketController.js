// controllers/ticketController.js
const Ticket = require('../models/ticketModel');
const { v4: uuidv4 } = require('uuid');

const releaseTickets = async (maxTickets, ticketsPerRelease, interval) => {
    let releasedTickets = 0;

    const releaseInterval = setInterval(async () => {
        if (releasedTickets >= maxTickets) {
            clearInterval(releaseInterval);
            console.log('All tickets released');
            return;
        }

        const ticketsToRelease = Math.min(ticketsPerRelease, maxTickets - releasedTickets);
        const tickets = [];

        for (let i = 0; i < ticketsToRelease; i++) {
            tickets.push({ ticketId: uuidv4() });
        }

        try {
            await Ticket.insertMany(tickets);
            releasedTickets += tickets.length;
            console.log(`${tickets.length} tickets released. Total released: ${releasedTickets}`);
        } catch (err) {
            console.error('Error releasing tickets:', err);
        }
    }, interval * 1000); // Convert seconds to milliseconds
};

module.exports = { releaseTickets };
