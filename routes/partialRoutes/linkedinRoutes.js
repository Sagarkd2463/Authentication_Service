const express = require('express');
const passport = require('passport');

const linkedinRouter = express.Router();

//Linkedin Routes
linkedinRouter.route('/').get(passport.authenticate('linkedin', { state: "LSKDFJ"}));

linkedinRouter.route('/callback').get(passport.authenticate('linkedin', {
    failureRedirect: '/login',
    successRedirect: '/home'
}));

linkedinRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            return;
        }
    });
    res.redirect('/');
});

module.exports = linkedinRouter;