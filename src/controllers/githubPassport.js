require('dotenv').config();
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const GitUser = require('../models/githubModel');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    GitUser.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GithubStrategy({
    clientID: "Ov23liw7G9MiknQ9yizk",
    clientSecret: "05625aefd470d70429ad6fbe55a0e81bde01b67f",
    callbackURL: "http://localhost:5000/auth/github/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await GitUser.findOne({ 'id': profile.id });

            if (user) {
                console.log("User Found:");
                console.log(user);
                return done(null, user);
            } else {
                // Create a new user if not found
                const newUser = new GitUser({
                    id: profile.id,
                    displayName: profile.displayName,
                    username: profile.username,
                    profileUrl: profile.profileUrl,
                    photo: profile.photos && profile.photos[0] ? profile.photos[0].value : '',  // Check if photo exists
                    provider: profile.provider
                });

                await newUser.save();  // Save the new user to the database
                console.log("New User Created:");
                console.log(newUser);
                return done(null, newUser);
            }
        } catch (err) {
            console.error("Error during GitHub authentication:", err);
            return done(err, false);
        }
    }
));

module.exports = GithubStrategy;