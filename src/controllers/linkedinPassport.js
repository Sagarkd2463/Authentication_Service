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
    clientID: "77te6ypqa2xqsw",
    clientSecret: "WPL_AP1.98ElCmbdVHQD8ELb.PF/oUQ==",
    callbackURL: "http://localhost:5000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
    state: true,
}, async function (accessToken, refreshToken, profile, done) {
    done(null, profile);
}));

module.exports = LinkedinStrategy;
