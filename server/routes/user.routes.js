const userModel = require('../models/user.model');
const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const checkCookie = require('../middlewares/auth.middleware')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// REGISTER Route
router.post('/user/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        // 2. Check for existing user (case-insensitive)
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // 3. Hash password and create user
        const user = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 12) // Hash here!
        });
        console.log(`agaya`)
        // 4. Generate token and respond
        const token = generateToken(user._id);
        res.cookie('sid', token, {
            httpOnly: true,
            secure: false,           // REMOVE secure for localhost
            sameSite: 'Lax',         // 'Lax' allows login and form requests
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(201).json({ _id: user._id, username, email });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// LOGIN Route
router.post('/user/login', async (req, res, next) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Invalid credentials'
                });
        }

        const token = generateToken(user._id)
        res.cookie('sid', token, {
            httpOnly: true,
             secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Logged in',
            user: { _id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// LOGOUT Route
router.get('/user/logout', (req, res) => {
    res.clearCookie('sid', {
        httpOnly: true,
        secure: false,           // REMOVE secure for localhost
        sameSite: 'Lax',         // 'Lax' allows login and form requests
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({ success: true, message: 'Logged out, cookie cleared' });
});


router.get('/user/profile', checkCookie, async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile',
        user: req.user
    })
})
module.exports = router;
