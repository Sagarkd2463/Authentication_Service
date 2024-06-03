const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');

const router = express.Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);


//Google Routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/login'
  }));


router.get('/auth/google/logout', (req, res) => {
    req.session.destroy();
    req.cookies.destroy();
    res.redirect('/');
});

module.exports = router;