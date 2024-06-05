require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GitUser = require('../models/githubUserModel');

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    GitUser.findById(id).then((user) => {
        cb(null, user);
    });
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/github/callback',
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null, profile);

        GitUser.findOne({ githubId: profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log('User is ', currentUser);
                return done(null, currentUser);
            } else {
                new GitUser({
                    githubId: profile.id,
                    username: profile.displayName,
                    userUrl: profile.profileUrl,
                    thumbnail: profile.photos.value,
                    origin: profile.provider
                }).save().then((newGithubUser) => {
                    console.log('New Github User created ', newGithubUser);
                    return done(null, newGithubUser);
                });
            }
        });
    })
);