// controllers/vendorController.js
const Vendor = require('../models/vendorModel');

const registerVendor = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newVendor = new Vendor({ name, email, password });
        await newVendor.save();
        res.status(201).json({ message: 'Vendor registered successfully', vendorId: newVendor._id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering vendor', error });
    }
};

module.exports = { registerVendor };
