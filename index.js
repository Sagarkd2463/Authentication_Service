require('dotenv').config();
// express files
const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// database fies
require('./database/db');
const FUser = require('./models/facebookModel');

// passport files 
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});
app.use('/', authRoutes);

<<<<<<< HEAD
=======
app.use(session({
    secret: process.env.ESESSION,
    resave: false,
    saveUninitialized: true,
}));

passport.use(new GoogleStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(null, profile);
        return done(null, profile);
    }
));

passport.use(new FacebookStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'picture.type(large)']
},
    function (accessToken, refreshToken, profile, done) {
        console.log(null, profile);
        return done(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.render('facebookDashboard');
    }
);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.render('googleDashboard');
    }
);

app.get('/auth/facebook/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/auth/google/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

>>>>>>> 26451a5 (Added google and facebook login)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});

