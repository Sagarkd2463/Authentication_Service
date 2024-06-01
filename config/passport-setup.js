const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const GUser = require('../models/googleUserModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    GUser.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL:'/auth/google/redirect'
    }, (accessToken, refreshtoken, profile, done) => {
        GUser.findOne({ googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                console.log('User is ', currentUser);
                done(null, currentUser);
            } else {
                new GUser({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.image.url
                }).save().then((newGoogleUser) => {
                    console.log('New Google User created ', newGoogleUser);
                    done(null, newGoogleUser);
                });
            }
        });
    })
);

