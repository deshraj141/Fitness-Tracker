const express = require('express');
const Nutrition = require('../models/Nutrition');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get all nutrition logs for a user
router.get('/', auth, async (req, res) => {
    try {
        const nutritionLogs = await Nutrition.find({ user: req.user.id }).sort({ date: -1 });
        res.json(nutritionLogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new nutrition log
router.post('/', auth, async (req, res) => {
    const { mealType, foodItems, totalCalories } = req.body;
    try {
        const nutrition = new Nutrition({
            user: req.user.id,
            mealType,
            foodItems,
            totalCalories
        });
        await nutrition.save();
        res.status(201).json(nutrition);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a nutrition log
router.put('/:id', auth, async (req, res) => {
    try {
        const nutrition = await Nutrition.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: req.body },
            { new: true }
        );
        if (!nutrition) return res.status(404).json({ message: 'Log not found' });
        res.json(nutrition);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a nutrition log
router.delete('/:id', auth, async (req, res) => {
    try {
        const nutrition = await Nutrition.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!nutrition) return res.status(404).json({ message: 'Log not found' });
        res.json({ message: 'Log deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
