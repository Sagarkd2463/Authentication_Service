require('dotenv').config();

// Express files
const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
// const cookieSession = require('cookie-session');

// Database files
require('./database/db');

// Passport files
const passport = require('passport');
require('./controllers/googlePassport');
require('./controllers/facebookPassport');
require('./controllers/githubPassport');
require('./controllers/linkedinPassport');
const { applyDefaults } = require('./models/userModel');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// // Session and cookie session configurations
// app.use(cookieSession({
//     name: 'Authentication',
//     secret: process.env.SESSION,
//     secure: false,
//     maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
// }));

app.use(session({
    secret: 'theninjaisawesomeiguess',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.get('/googleDashboard', (req, res) => {
    res.render("googleDashboard", { name: req.user.displayName, email: req.user.emails[0].value, pic: req.user.photos[0].value });
});

app.get('/facebookDashboard', (req, res) => {
    res.render('facebookDashboard', { name: req.user.displayName, email: req.user.emails[0].value, pic: req.user.photos[0].value });
});

app.get('/githubDashboard', (req, res) => {
    res.render('githubDashboard', { name: req.user.displayName, pic: req.user.photos[0].value });
});

app.get('/linkedinDashboard', (req, res) => {
    res.render('linkedinDashboard', { name: req.user.displayName });
});

app.get('/auth/google',
    passport.authenticate('google', { scope: 'email' })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
    }),
    (req, res) => {
        console.log('Successfully authenticated with Google');
        console.log('User:', req.user);
        res.redirect('/googleDashboard');
    }
);

app.get('/auth/google/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout(() => res.redirect('/'));
    });
});

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
    }),
    (req, res) => {
        console.log('Successfully authenticated with Facebook');
        res.redirect('/facebookDashboard');
    }
);

app.get('/auth/facebook/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout(() => res.redirect('/'));
    });
});

app.get('/auth/github',
    passport.authenticate('github', { scope: 'email' })
);

app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
    }),
    (req, res) => {
        console.log('Successfully authenticated with GitHub');
        res.redirect('/githubDashboard');
    }
);

app.get('/auth/github/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout(() => res.redirect('/'));
    });
});

app.get('/auth/linkedin',
    passport.authenticate('linkedin', { scope: 'email' })
);

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
        failureRedirect: '/login',
        failureMessage: 'Oops! Login failed, Please try again!!',
    }),
    (req, res) => {
        console.log('Successfully authenticated with LinkedIn');
        res.redirect('/linkedinDashboard');
    }
);

app.get('/auth/linkedin/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout(() => res.redirect('/'));
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});