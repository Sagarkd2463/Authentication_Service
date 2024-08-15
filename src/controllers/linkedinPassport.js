require('dotenv').config();
const passport = require('passport');
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    done(null, id);
});

passport.use(new LinkedinStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:5000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
    state: true,
}, async function (accessToken, refreshToken, profile, done) {
    try {
        console.log('Profile:', profile);
        done(null, profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        done(error);
    }
}));

module.exports = LinkedinStrategy;
