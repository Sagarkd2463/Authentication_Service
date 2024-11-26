const passport = require('passport');
const app = require('express').Router();

app.get('/auth/google',
    passport.authenticate('google', { scope: 'email' })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/success/google');
    });

app.get('/auth/google/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout(() => res.redirect('/'));
    });
});

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/auth/facebook/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout(() => res.redirect('/'));
    });
});


app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/auth/github/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout(() => res.redirect('/'));
    });
});

app.get('/auth/linkedin',
    passport.authenticate('linkedin', { state: true })
);

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/auth/linkedin/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

module.exports = app;