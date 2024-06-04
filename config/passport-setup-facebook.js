require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const FUser = require('../models/facebookUserModel');

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((id, cb) => {
    FUser.findById(id).then((user) => {
        cb(null, user);
    })
});

passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        return done(null, profile);
    })
);