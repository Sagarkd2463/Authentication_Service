require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GUser = require('../models/googleModel');

passport.serializeUser(function (googleuser, done) {
    done(null, googleuser.id);
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
            const user = await GUser.findOne({ 'id': profile.id });

            if (!user) return done(null, false);

            if (user) {
                console.log(" User Found ");
                console.log(user);
                return done(null, user);
            } else {
                const newUser = new GUser();

                newUser.id = profile.id;
                newUser.displayName = profile.displayName;
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

module.exports = GoogleStrategy;