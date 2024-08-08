require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const FUser = require('../models/facebookModel');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    FUser.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: "453285177505178",
    clientSecret: "c0f029cec353c95bc12817d6c534a503",
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'picture.type(large)']
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await FUser.findOne({ 'id': profile.id });

            if (user) {
                console.log("User Found:");
                console.log(user);
                return done(null, user);
            } else {
                // Create a new user if not found
                const newUser = new FUser({
                    id: profile.id,
                    displayName: profile.displayName,
                    gender: profile.gender,
                    email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',  // Check if email exists
                    photo: profile.photos && profile.photos[0] ? profile.photos[0].value : '',  // Check if photo exists
                    provider: profile.provider
                });

                await newUser.save();  // Save the new user to the database
                console.log("New User Created:");
                console.log(newUser);
                return done(null, newUser);
            }
        } catch (err) {
            console.error("Error during Facebook authentication:", err);
            return done(err, false);
        }
    }
));

module.exports = FacebookStrategy;
