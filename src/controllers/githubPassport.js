const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const GitUser = require('../models/githubModel');
const { default: mongoose } = require('mongoose');
const config = require('../config/config');

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async function (id, done) {
    try {
        const user = await GitUser.findById(id);
        done(null, user);
    } catch (error) {
        done(null, error);
    }
});

// Github Strategy setup
passport.use(new GithubStrategy({
    clientID: config.githubAuthenticate.GITHUB_CLIENT_ID,
    clientSecret: config.githubAuthenticate.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/github/callback',
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await GitUser.findOne({ githubId: profile.id.toString() });

            if (user) {
                return done(null, user);
            } else {
                // Create a new user if not found
                const newUser = new GitUser({
                    _id: new mongoose.Types.ObjectId(),
                    githubId: profile.id,
                    displayName: profile.displayName,
                    username: profile.username,
                    profileUrl: profile.profileUrl,
                    photo: profile.photos && profile.photos[0] ? profile.photos[0].value : '',  // Check if photo exists
                    provider: profile.provider
                });

                await newUser.save();  // Save the new user to the database
                return done(null, newUser);
            }
        } catch (err) {
            console.error("Error during GitHub authentication:", err);
            return done(null, err);
        }
    }
));

module.exports = GithubStrategy;