require('dotenv').config();
const passport = require('passport');
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

passport.serializeUser(function (linkedinuser, done) {
    done(null, linkedinuser.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

passport.use(new LinkedinStrategy({
    clientID: "77te6ypqa2xqsw",
    clientSecret: "WPL_AP1.98ElCmbdVHQD8ELb.PF/oUQ==",
    callbackURL: "http://localhost:5000/auth/linkedin/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(null, profile);
        return done(null, profile);
    }
));

module.exports = LinkedinStrategy;