const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');

const router = express.Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('You reached the redirect URI');
});

module.exports = router;