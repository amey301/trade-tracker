const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Automatically convert email to lowercase
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false // Never return password in queries
    },
    trades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trade',
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Optional: Add methods (e.g., for password comparison)
userSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;