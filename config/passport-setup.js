const passport = require('passport');
const Googlestrategy = require('passport-google-oauth20');
const keys = require('./keys');

passport.use(
    new Googlestrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
    }), () => {

    }
)

