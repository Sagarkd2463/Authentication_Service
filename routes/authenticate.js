const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const authMiddleware = require('../middleware/auth');
const { registeredUserValidate, loginUserValidate } = require('../middleware/validUser');
const UserModel = require('../models/userModel');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/users', authMiddleware, async (req, res) => {
    try {
        const allUsers = await UserModel.find({}, { password: 0 });
        return res.status(200).json({ data: allUsers });
    } catch (err) {
        return res.status(500).json({ message: "failed", err });
    }
});

router.post('/register', registeredUserValidate, async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send({ message: 'Username, email and password is required!' });
    }

    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(password, 10);

    try {
        const data = await user.save();
        data.password = undefined;
        return res.status(201).json({ message: "success", response: data });
    } catch (err) {
        return res.status(500).json({ message: "failed", err });
    }
});

router.post('/login', loginUserValidate, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password is required!' });
    }

    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: "Auth failed, no user with this email is registered!" });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({ message: "Password is incorrect, Please try again!" });
        }

        const tokenObj = {
            _id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(tokenObj, config.secret, { expiresIn: '4h' });
        return res.status(200).json({ token, tokenObj });
    } catch (err) {
        return res.status(500).json({ message: "failed", err });
    }
});

module.exports = router;