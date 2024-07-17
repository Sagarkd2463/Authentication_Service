require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const FUser = require('../models/facebookModel');

passport.serializeUser(function (facebookuser, done) {
    done(null, facebookuser.id);
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
            const user = await FUser.findOne({ 'id': profile.id });

            if (!user) return done(null, false);

            if (user) {
                console.log(" User Found ");
                console.log(user);
                return done(null, user);
            } else {
                const newUser = new FUser();

                newUser.id = profile.id;
                newUser.displayName = profile.displayName;
                newUser.gender = profile.gender;
                newUser.email = profile.emails[0].value;
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

module.exports = FacebookStrategy;