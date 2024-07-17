require('dotenv').config();
// express files
const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// database fies
require('./database/db');

// passport files 
const passport = require('passport');
const GoogleStrategy = require('./controllers/googlePassport');
const FacebookStrategy = require('./controllers/facebookPassport');
const GithubStrategy = require('./controllers/githubPassport');
const LinkedinStrategy = require('./controllers/linkedinPassport');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, __dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.get('/googleDashboard', (req, res) => {
    res.render('googleDashboard', { user: req.user });
});

app.get('/facebookDashboard', (req, res) => {
    res.render('facebookDashboard', { user: req.user });
});

app.get('/githubDashboard', (req, res) => {
    res.render('githubDashboard', { user: req.user });
});

app.get('/linkedinDashboard', (req, res) => {
    res.render('linkedinDashboard', { user: req.user });
});

app.use('/', authRoutes);

app.use(session({
    secret: process.env.ESESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


app.use(passport.initialize());
app.use(passport.session());

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

app.get('/auth/facebook/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/auth/google/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/auth/github/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/auth/linkedin/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});

