const tradeModel = require('../models/trade.model');
const express = require('express');
const userModel = require('../models/user.model');
const checkCookie = require('../middlewares/auth.middleware');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { default: mongoose } = require('mongoose');
const JWT_SECRET = process.env.JWT_SECRET

router.post('/user/form', checkCookie, async (req, res) => {
    try {
        const { date, assetType, entryPrice, exitPrice, fees, quantity, symbol, tradeType } = req.body;

        if (!date || !assetType || !entryPrice || !exitPrice || !fees || !quantity || !symbol || !tradeType) {
            return res.status(400).json({
                success: false,
                message: 'All Fields are required'
            });
        }

        userId = req.user._id
        console.log(`this is id`, req.user._id)

        const newTrade = new tradeModel({
            userId, ...req.body
        });

        const createdTrade = await newTrade.save();

        const userFound = await userModel.findById(userId);
        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        userFound.trades.push(createdTrade._id);
        await userFound.save();

        res.status(201).json({
            success: true,
            data: createdTrade,
            message: 'Trade created successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message || err
        });
    }
});

router.get('/user/trades', checkCookie, async (req, res) => {
    try {
        const userId = req.user._id; // From checkCookie middleware
        console.log('User ID from token:', userId);

        // Find all trades for this user
        const trades = await tradeModel.find({ userId }).populate('userId');

        res.status(200).json({
            success: true,
            data: trades, // could be empty array
            message: trades.length ? 'Trades fetched successfully' : 'No trades found'
        });

    } catch (err) {
        console.error('Error fetching trades:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trades',
            error: err.message
        });
    }
});

router.delete('/user/trade/delete/:id', checkCookie, async (req, res) => {
  try {
    const tradeId = req.params.id
    console.log(tradeId)
    const userId = req.user._id;
    console.log(userId)

    if (!tradeId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Trade'
      });
    }

    // Ensure only the owner's trade can be deleted
    const trade = await tradeModel.findOne({ _id: tradeId, userId });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found or unauthorized'
      });
    }

    await tradeModel.findByIdAndDelete(tradeId);

    res.status(200).json({
      success: true,
      message: 'Trade deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting trade:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});


module.exports = router;
