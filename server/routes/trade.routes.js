const express = require('express');
const Trade = require('../models/trade.model');
const User = require('../models/user.model');
const router = express.Router();

// Create a new trade and append to the user's trades array
router.post('/create', async (req, res) => {
    try {
        const { userId, strategy, date, symbol, entryPrice, exitPrice, pnl } = req.body;

        // 1️⃣ Create the trade
        const newTrade = await Trade.create({
            user: userId,
            strategy,
            date,
            symbol,
            entryPrice,
            exitPrice,
            pnl
        });

        // 2️⃣ Append trade ID to user's trades array
        await User.findByIdAndUpdate(
            userId,
            { $push: { trades: newTrade._id } },
            { new: true }
        );

        res.status(201).json({
            message: 'Trade created and linked to user',
            trade: newTrade
        });
    } catch (error) {
        console.error('Error creating trade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all trades for a user
router.get('/:userId', async (req, res) => {
    try {
        const trades = await Trade.find({ user: req.params.userId }).populate('strategy');
        res.json(trades);
    } catch (error) {
        console.error('Error fetching trades:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete a trade and remove from user's trades array
router.delete('/delete/:tradeId', async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.tradeId);
        if (!trade) return res.status(404).json({ error: 'Trade not found' });

        // Remove trade from User model
        await User.findByIdAndUpdate(
            trade.user,
            { $pull: { trades: trade._id } }
        );

        await trade.deleteOne();
        res.json({ message: 'Trade deleted successfully' });
    } catch (error) {
        console.error('Error deleting trade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
