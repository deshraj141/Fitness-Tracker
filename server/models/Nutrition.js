const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
    foodItems: [{
        name: { type: String, required: true },
        calories: { type: Number },
        protein: { type: Number },
        carbs: { type: Number },
        fats: { type: Number }
    }],
    totalCalories: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
