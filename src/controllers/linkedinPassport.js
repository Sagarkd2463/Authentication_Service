require('dotenv').config();
const passport = require('passport');
const config = require('../config/config');
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const LinkedinUser = require('../models/linkedinModel');

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async function (id, done) {
    try {
        const user = await LinkedinUser.findById(id);
        done(null, user);
    } catch (error) {
        done(null, error);
    }
});

// Linkedin Strategy setup
passport.use(new LinkedinStrategy({
    clientID: config.linkedinAuthenticate.LINKEDIN_CLIENT_ID,
    clientSecret: config.linkedinAuthenticate.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/linkedin/callback',
    scope: ['openid', 'profile', 'email'],
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await LinkedinUser.findOne({ linkedinId: profile.id.toString() });

            if (user) {
                return done(null, user);
            } else {
                // Create a new user if not found
                const newUser = new LinkedinUser({
                    _id: new mongoose.Types.ObjectId(),
                    linkedinId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',  // Check if email exists
                    photo: profile.photos && profile.photos[0] ? profile.photos[0].value : '',  // Check if photo exists
                    provider: profile.provider
                });

                await newUser.save();  // Save the new user to the database
                console.log(newUser);
                return done(null, newUser);
            }
        } catch (err) {
            console.error("Error during Linkedin authentication:", err);
            return done(null, err);
        }
    }
));

module.exports = LinkedinStrategy;
