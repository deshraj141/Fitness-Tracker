const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get user goals
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('goals');
        res.json(user.goals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user goals
router.put('/', auth, async (req, res) => {
    const { weight, steps, calories } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (weight) user.goals.weight = weight;
        if (steps) user.goals.steps = steps;
        if (calories) user.goals.calories = calories;

        await user.save();
        res.json(user.goals);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
