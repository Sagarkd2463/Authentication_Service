require('dotenv').config();
const passport = require('passport');
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const LUser = require('../models/linkedinUserModel');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    LUser.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new LinkedinStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/linkedin/callback',
    scope:['profile', 'email'],
    state: true,
}, 
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null, profile);

        LUser.findOne({ linkedinId: profile.id }).then((currUser) => {
            if(currUser){
                console.log('User is', currUser);
                return done(null, currUser);
            } else {
                new LUser({
                    linkedinId: profile.id,
                    username: profile.displayName,
                    email: profile.emails.value,
                    thumbnail: profile.photos[2].value,
                    origin: profile.provider
                }).save().then((newlinkedinUser) => {
                    console.log('New LinkedIn User created ', newlinkedinUser);
                    return done(null, newlinkedinUser);
                });
            }
        });
    })
);