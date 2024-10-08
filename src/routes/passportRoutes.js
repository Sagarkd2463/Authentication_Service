const passport = require('passport');
const app = require('express').Router();

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

module.exports = app;