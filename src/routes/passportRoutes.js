const passport = require('passport');
const app = require('express').Router();

function handleAuthError(err, req, res, next) {
    console.error("Authentication error:", err);
    res.status(500).render('error', {
        message: 'Authentication failed. Please try again.',
        error: err.message || 'An unexpected error occurred.'
    });
}

// Google Authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: 'email' })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('/login');
        }
        res.render("profilegoogle", {
            name: req.user.displayName,
            pic: req.user.photos?.[0].value,
            provider: req.user.provider
        });
    },
    handleAuthError
);

app.get('/auth/google/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Logout failed.');
        req.logout(() => res.redirect('/'));
    });
});

// Facebook Authentication
app.get('/auth/facebook',
    passport.authenticate('facebook')
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('/login');
        }
        res.render('profilefacebook', {
            name: req.user.displayName,
            email: req.user.emails?.[0].value,
            pic: req.user.photos?.[0].value,
            provider: req.user.provider
        });
    },
    handleAuthError
);

app.get('/auth/facebook/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Logout failed.');
        req.logout(() => res.redirect('/'));
    });
});

// GitHub Authentication
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('/login');
        }
        res.render('profilegithub', {
            name: req.user.displayName,
            username: req.user.username,
            pic: req.user.photos?.[0].value,
            profileUrl: req.user.profileUrl,
            provider: req.user.provider
        });
    },
    handleAuthError
);

app.get('/auth/github/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Logout failed.');
        req.logout(() => res.redirect('/'));
    });
});

// LinkedIn Authentication
app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: "SOME STATE" })
);

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('/login');
        }
        res.render('profilelinkedin', {
            name: req.user.displayName || `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.emails?.[0].value,
            photo: req.user.photos?.[0].value,
            provider: req.user.provider
        });
    },
    handleAuthError
);

app.get('/auth/linkedin/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

// Fallback route for unexpected errors
app.use((err, req, res, next) => {
    console.error("Unexpected error:", err);
    res.status(500).render('error', {
        message: 'An unexpected error occurred.',
        error: err.message || 'Please try again later.'
    });
});

module.exports = app;