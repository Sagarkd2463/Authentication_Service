const express = require('express');

const app = express.Router();

app.get('/success/google', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/google');
    }

    try {
        res.render("profilegoogle", {
            name: req.user.displayName,
            pic: req.user.photos?.[0].value,
            provider: req.user.provider
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
            email: req.user.emails?.[0].value,
            pic: req.user.photos?.[0].value,
            provider: req.user.provider
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
            pic: req.user.photos?.[0].value,
            profileUrl: req.user.profileUrl,
            provider: req.user.provider
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
            name: req.user.displayName || `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.emails?.[0].value,
            photo: req.user.photos?.[0].value,
            provider: req.user.provider
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;