const express = require('express');
const passport = require('passport');

const facebookRouter = express.Router();

facebookRouter.route('/').get(passport.authenticate('facebook', { scope: ['public_profile', 'email']}));

facebookRouter.route('/callback').get(passport.authenticate('facebook', {
    failureRedirect:'/login',
    successRedirect:'/home'
}));

facebookRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = facebookRouter;