const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    symbol: {
        type: String,
        required: true,
        trim: true
    },
    assetType: {
        type: String,
        enum: ['crypto', 'stock', 'index'],
        required: true
    },
    tradeType: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    quantity: {
        type: Number,
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
    fees: {
        type: Number,
        default: 0
    },
    pnl: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model("Trade", tradeSchema);
