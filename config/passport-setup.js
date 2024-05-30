const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const GUser = require('../models/googleUserModel');

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL:'/auth/google/redirect'
    }, (accessToken, refreshtoken, profile, done) => {
        console.log('Passport callback function was fired...');
        console.log(profile);

        new GUser({
            googleId: profile.id,
            username: profile.displayName
        }).save().then((newGoogleUser) => {
            console.log('New Google User created ', newGoogleUser);
        });
    })
);

