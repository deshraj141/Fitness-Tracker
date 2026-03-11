const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // e.g., Running, Weightlifting
    duration: { type: Number, required: true }, // in minutes
    caloriesBurned: { type: Number },
    intensity: { type: String, enum: ['Light', 'Moderate', 'Heavy'], default: 'Moderate' },
    details: {
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number }
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);
