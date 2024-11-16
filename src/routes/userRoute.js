const express = require('express');
const { userRegister, userLogin, forgotPassword, resetPassword } = require('../controllers/userAuthController');
const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/forget-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;