const express = require('express');
const passport = require('passport');
const { sendVerificationCode, verifyVerificationCode } = require('../controllers/userAuthController');
const { isAuthenticated } = require('../controllers/userPassport');
const { identifier } = require('../middleware/identification');

const router = express.Router();

router.post("/register");

// Login route with passport authentication
router.post("/login", passport.authenticate('local', {
    successRedirect: "/profile",
    successFlash: true,
    failureRedirect: "/register",
    failureFlash: true
}));

router.post("/logout", identifier, (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profileUser', { name: req.user.name, email: req.user.email });
});

router.patch('/send-verification-code', identifier, sendVerificationCode);

router.patch('/verify-verification-code', identifier, verifyVerificationCode);

module.exports = router;