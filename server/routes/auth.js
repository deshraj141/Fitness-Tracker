const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/register', async (req, res) => {
    console.log('POST /api/auth/register', req.body);
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        // demo credentials auto-registration/fallback
        const DEMO_EMAIL = 'demo@demo.com';
        const DEMO_PASSWORD = 'demopass';
        const DEMO_USERNAME = 'DemoUser';

        if (!user) {
            // if the request matches the demo account, create it automatically
            if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
                user = new User({ username: DEMO_USERNAME, email, password });
                await user.save();
                console.log('Created demo user on-login fallback');
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (err) {
        console.error('login error', err);
        res.status(500).json({ message: err.message });
    }
});

const auth = require('../middlewares/auth');

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const { username, age, height, gender } = req.body;
        const user = await User.findById(req.user.id);
        if (username) user.username = username;
        if (age) user.age = age;
        if (height) user.height = height;
        if (gender) user.gender = gender;

        await user.save();
        res.json({ user: { id: user._id, username: user.username, email: user.email, age: user.age, height: user.height, gender: user.gender } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
