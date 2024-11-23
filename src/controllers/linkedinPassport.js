require('dotenv').config();
const passport = require('passport');
const config = require('../config/config');
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async function (id, done) {
    done(null, id);
});

// Linkedin Strategy setup
passport.use(new LinkedinStrategy({
    clientID: config.linkedinAuthenticate.LINKEDIN_CLIENT_ID,
    clientSecret: config.linkedinAuthenticate.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile'],
}, async function (accessToken, refreshToken, profile, done) {
    try {
        console.log('Profile:', profile);
        done(null, profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        done(error);
    }
}));

module.exports = LinkedinStrategy;
