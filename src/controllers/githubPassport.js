require('dotenv').config();
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const GitUser = require('../models/githubModel');

passport.serializeUser(function (githubuser, done) {
    done(null, githubuser.id);
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
            const user = await GitUser.findOne({ 'id': profile.id });

            if (!user) return done(null, false);

            if (user) {
                console.log(" User Found ");
                console.log(user);
                return done(null, user);
            } else {
                const newUser = new GitUser();

                newUser.id = profile.id;
                newUser.displayName = profile.displayName;
                newUser.username = profile.username;
                newUser.profileUrl = profile.profileUrl;
                newUser.photo = profile.photos[0].value;
                newUser.provider = profile.provider;

                newUser.save(function (err) {
                    if (err) throw err;

                    return done(null, newUser);
                });
            }
        } catch (err) {
            return done(err, false);
        }
    }
));

module.exports = GithubStrategy;