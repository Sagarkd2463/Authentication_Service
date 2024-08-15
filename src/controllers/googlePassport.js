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
        done(user, null);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy setup
passport.use(new GoogleStrategy({
    clientID: '274907625225-fpnalasfn49gbmbkadnohfv73e0huk2c.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await GUser.findOne({ googleId: profile.id });

            if (user) {
                console.log("User Found:");
                console.log(user);
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
                console.log("New User Created:");
                console.log(newUser);
                return done(null, newUser);
            }
        } catch (err) {
            console.error("Error during Google authentication:", err);
            return done(err, false);
        }
    }
));

module.exports = GoogleStrategy;