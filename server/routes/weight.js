const express = require('express');
const Weight = require('../models/Weight');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get all weight logs for a user
router.get('/', auth, async (req, res) => {
    try {
        const logs = await Weight.find({ user: req.user.id }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new weight log
router.post('/', auth, async (req, res) => {
    const { weight, date } = req.body;
    try {
        const log = new Weight({
            user: req.user.id,
            weight,
            date: date || Date.now()
        });
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a weight log
router.delete('/:id', auth, async (req, res) => {
    try {
        const log = await Weight.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!log) return res.status(404).json({ message: 'Log not found' });
        res.json({ message: 'Log deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
