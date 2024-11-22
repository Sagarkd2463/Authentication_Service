const express = require('express');
const { userRegister, userLogin, forgotPassword, resetPassword } = require('../controllers/userAuthController');
const { registerValidationSchema, loginValidationSchema, forgotPasswordValidationSchema, resetPasswordValidationSchema, validateRequest } =
    require('../middleware/validUser');
const router = express.Router();

router.post("/register", validateRequest(registerValidationSchema), userRegister);

router.post("/login", validateRequest(loginValidationSchema), userLogin);

router.post("/forget-password", validateRequest(forgotPasswordValidationSchema), forgotPassword);

router.post("/reset-password/:token", validateRequest(resetPasswordValidationSchema), resetPassword);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;