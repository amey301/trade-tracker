const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    strategy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Strategy'
    },
    date: {
        type: Date,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    entryPrice: {
        type: Number,
        required: true
    },
    exitPrice: {
        type: Number,
        required: true
    },
    pnl: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
