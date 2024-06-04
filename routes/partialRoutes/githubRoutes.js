const express = require('express');
const passport = require('passport');

const githubRouter = express.Router();

//Github Routes
githubRouter.route('/').get(passport.authenticate("github"));

githubRouter.route('/callback').get(passport.authenticate("github", {
    failureRedirect: '/login',
    successRedirect: '/home'
}));

githubRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = githubRouter;