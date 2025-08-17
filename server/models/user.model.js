const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    trades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade'
    }],
    strategies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Strategy'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
