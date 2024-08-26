require('dotenv').config();

// Express files
const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

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

app.get('/success/google', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/google');
    }

    try {
        res.render("profilegoogle", {
            name: req.user.displayName,
            email: req.user.emails?.[0]?.value,
            pic: req.user.photos?.[0]?.value
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/success/facebook', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/facebook');
    }

    try {
        res.render('profilefacebook', {
            name: req.user.displayName,
            email: req.user.emails?.[0]?.value,
            pic: req.user.photos?.[0]?.value
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/success/github', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/github');
    }

    try {
        res.render('profilegithub', {
            name: req.user.displayName,
            pic: req.user.photos?.[0]?.value
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/success/linkedin', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/linkedin');
    }

    try {
        res.render('profilelinkedin', {
            name: req.user.displayName
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
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
        res.redirect('/success/google');
    }
);

app.get('/auth/google/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.status(500).send('Internal Server Error');
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Error during session destruction:", err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/');
        });
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
        res.redirect('/success/facebook');
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
        res.redirect('/success/github');
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
        res.redirect('/success/linkedin');
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