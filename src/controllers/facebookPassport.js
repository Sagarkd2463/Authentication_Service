const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const FUser = require('../models/facebookModel');
const { default: mongoose } = require('mongoose');
const config = require('../config/config');

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async function (id, done) {
    try {
        const user = await FUser.findById(id);
        done(null, user);
    } catch (error) {
        done(null, error);
    }
});

// Facebook Strategy setup
passport.use(new FacebookStrategy({
    clientID: config.facebookAuthenticate.FACEBOOK_CLIENT_ID,
    clientSecret: config.facebookAuthenticate.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'picture.type(large)']
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await FUser.findOne({ facebookId: profile.id.toString() });

            if (user) {
                return done(null, user);
            } else {
                // Create a new user if not found
                const newUser = new FUser({
                    _id: new mongoose.Types.ObjectId(),
                    facebookId: profile.id,
                    displayName: profile.displayName,
                    gender: profile.gender,
                    email: profile.emails && profile.emails?.[0] ? profile.emails?.[0].value : '',  // Check if email exists
                    photo: profile.photos && profile.photos?.[0] ? profile.photos?.[0].value : '',  // Check if photo exists
                    provider: profile.provider
                });

                await newUser.save();  // Save the new user to the database
                console.log(newUser);
                return done(null, newUser);
            }
        } catch (err) {
            console.error("Error during Facebook authentication:", err);
            return done(null, err);
        }
    }
));

module.exports = FacebookStrategy;
