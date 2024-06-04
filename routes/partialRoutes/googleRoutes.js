const express = require('express');
const passport = require('passport');

const googleRouter = express.Router();

//Google Routes
googleRouter.get('/',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

googleRouter.get('/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/login'
    }));

googleRouter.get('/logout', (req, res) => {
    req.session.destroy();
    req.cookies.destroy();
    res.redirect('/');
});

module.exports = googleRouter;