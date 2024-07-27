require('dotenv').config();
// express files
const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieSession = require('cookie-session');

// database fies
require('./database/db');

// passport files 
const passport = require('passport');
const GoogleStrategy = require('./controllers/googlePassport');
const FacebookStrategy = require('./controllers/facebookPassport');
const GithubStrategy = require('./controllers/githubPassport');
const LinkedinStrategy = require('./controllers/linkedinPassport');
const { applyDefaults } = require('./models/userModel');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, __dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/', authRoutes);

app.use(cookieSession({
    name: 'Authentication',
    secret: process.env.SESSION,
    secure: true,
    expires: 3 * 24 * 60 * 60,
}));

app.use(session({
    secret: process.env.ESESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('home.ejs', { user: req.user });
});

app.get('/googleDashboard', (req, res) => {
    res.render("views/googleDashboard.ejs", { name: req.user.displayName, email: req.user.emails[0].value, pic: req.user.photos[0].value });
});

app.get('/facebookDashboard', (req, res) => {
    res.render('views/facebookDashboard.ejs', { name: req.user.displayName, email: req.user.emails[0].value, pic: req.user.photos[0].value });
});

app.get('/githubDashboard', (req, res) => {
    res.render('views/githubDashboard.ejs', { name: req.user.displayName, pic: req.user.photos[0].value });
});

app.get('/linkedinDashboard', (req, res) => {
    res.render('views/linkedinDashboard.ejs', { name: req.user.displayName });
});

app.get('/auth/google',
    passport.authenticate('google', { scope: 'email' }),
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
        successRedirect: '/googleDashboard',
        successMessage: 'Successfully Logged in!!!'
    }),
);

app.get('/auth/google/logout', (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' }),
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
        successRedirect: '/facebookDashboard',
        successMessage: 'Successfully Logged in!!!'
    }),
);

app.get('/auth/facebook/logout', (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

app.get('/auth/github',
    passport.authenticate('github', { scope: 'email' }),
);

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
        successRedirect: '/githubDashboard',
        successMessage: 'Successfully Logged in!!!'
    }),
);

app.get('/auth/github/logout', (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

app.get('/auth/linkedin',
    passport.authenticate('linkedin', { scope: 'email' }),
);

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
        successRedirect: '/linkedinDashboard',
        successMessage: 'Successfully Logged in!!!'
    }),
);

app.get('/auth/linkedin/logout', (req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});

