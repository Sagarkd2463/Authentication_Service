require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GUser = require('../models/googleUserModel');

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    GUser.findById(id).then((user) => {
        cb(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback',
        passReqToCallback: true
    },
        function (accessToken, refreshtoken, profile, done) {
            console.log(profile);
            done(null, profile);

            GUser.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    console.log('User is ', currentUser);
                    return done(null, currentUser);
                } else {
                    new GUser({
                        googleId: profile.id,
                        username: profile.displayName,
                        thumbnail: profile._json.image.url
                    }).save().then((newGoogleUser) => {
                        console.log('New Google User created ', newGoogleUser);
                        return done(null, newGoogleUser);
                    });
                }
            });
        })
);

