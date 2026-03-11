const express = require('express');
const Water = require('../models/Water');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get all water logs for a user (or for today)
router.get('/', auth, async (req, res) => {
    try {
        const logs = await Water.find({ user: req.user.id }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add water intake
router.post('/', auth, async (req, res) => {
    const { amount, date } = req.body;
    try {
        const log = new Water({
            user: req.user.id,
            amount,
            date: date || Date.now()
        });
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a water log
router.delete('/:id', auth, async (req, res) => {
    try {
        const log = await Water.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!log) return res.status(404).json({ message: 'Log not found' });
        res.json({ message: 'Log deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
