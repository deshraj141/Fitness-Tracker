const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    goals: {
        weight: { type: Number },
        steps: { type: Number, default: 10000 },
        calories: { type: Number, default: 2000 }
    },
    age: { type: Number },
    height: { type: Number },
    gender: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// using an async pre-save hook returns a promise, so we don't need to call next()
// calling next() in an async function can result in "next is not a function" errors
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
