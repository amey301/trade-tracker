const express = require('express');
const router = express.Router();
const Strategy = require('../models/strategy.model'); // import model
const User = require('../models/user.model'); // import user model


// CREATE a strategy with linking to user
router.post('/create', async (req, res) => {
  try {
    const { name, description, user } = req.body;

    if (!name || !description || !user) {
      return res.status(400).json({ message: 'Name, description, and user are required' });
    }

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newStrategy = new Strategy({ name, description, user });
    const savedStrategy = await newStrategy.save();

    await User.findByIdAndUpdate(user, { $push: { strategies: savedStrategy._id } });

    res.status(201).json(savedStrategy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating strategy', error: error.message });
  }
});





// GET all strategies
router.get('/get', async (req, res) => {
  try {
    const strategies = await Strategy.find().populate('user', 'username email'); // populate user details
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching strategies', error });
  }
});


// GET strategy by ID
router.get('/get/:id', async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.id).populate('user', 'username email'); // populate user details
    if (!strategy) return res.status(404).json({ message: 'Strategy not found' });
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching strategy', error });
  }
});


// DELETE strategy by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedStrategy = await Strategy.findByIdAndDelete(req.params.id);
    if (!deletedStrategy) return res.status(404).json({ message: 'Strategy not found' });
    res.json({ message: 'Strategy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting strategy', error });
  }
});

module.exports = router;
