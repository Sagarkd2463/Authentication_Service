require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GUser = require('../models/googleModel');
const { default: mongoose } = require('mongoose');

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async function (id, done) {
    try {
        const user = await GUser.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await GUser.findOne({ googleId: profile.id });

            if (user) {
                console.log("User Already Found...");
                return done(null, user);
            } else {
                // Create a new user if not found
                const newUser = new GUser({
                    _id: new mongoose.Types.ObjectId(),
                    googleId: profile.id,
                    displayName: profile.displayName,
                    photo: profile.photos && profile.photos[0] ? profile.photos[0].value : '',  // Check if photo exists
                    provider: profile.provider
                });

                await newUser.save();  // Save the new user to the database
                console.log("New User Created");
                return done(null, newUser);
            }
        } catch (err) {
            console.error("Error during Google authentication:", err);
            return done(err, false);
        }
    }
));

module.exports = GoogleStrategy;