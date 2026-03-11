const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get all workouts for a user
router.get('/', auth, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new workout
router.post('/', auth, async (req, res) => {
    const { type, duration, caloriesBurned, intensity, details } = req.body;
    try {
        const workout = new Workout({
            user: req.user.id,
            type,
            duration,
            caloriesBurned,
            intensity,
            details
        });
        await workout.save();
        res.status(201).json(workout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a workout
router.put('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: req.body },
            { new: true }
        );
        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        res.json(workout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        res.json({ message: 'Workout deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
