const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const JWT_SECRET = process.env.JWT_SECRET;

const checkCookie = async (req, res, next) => {
    const token = req.cookies?.sid;
    console.log('Received token from cookie:', token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Invalid token'
            });
        }

        req.user = user;
        console.log('Authenticated user:', req.user);
        next();

    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(401).json({
            success: false,
            error: err.message,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = checkCookie;
