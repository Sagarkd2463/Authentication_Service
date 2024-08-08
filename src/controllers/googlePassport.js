require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GUser = require('../models/googleModel');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    GUser.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: "274907625225-pnsmk781m0hqlkagrr6qf7ae35pnv7ar.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await GUser.findOne({ 'id': profile.id });

            if (user) {
                console.log("User Found:");
                console.log(user);
                return done(null, user);
            } else {
                // Create a new user if not found
                const newUser = new GUser({
                    id: profile.id,
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