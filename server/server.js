const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const nutritionRoutes = require('./routes/nutrition');
const goalRoutes = require('./routes/goals');
const waterRoutes = require('./routes/water');
const weightRoutes = require('./routes/weight');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
    credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/weight', weightRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables.');
    // In production, we might want to exit if the DB is critical
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker')
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        if (process.env.NODE_ENV === 'production') process.exit(1);
    });

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Backend API: http://localhost:${PORT}/api`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
