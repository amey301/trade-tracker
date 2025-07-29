const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user.model');

// Passport config
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

module.exports = passport;
