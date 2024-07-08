const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const users = [];

router.post('/register', async (req, resp) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return resp.status(400).send({ message: 'Username and password is required!' })
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return resp.status(400).send({ message: 'User is already registered!' })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username: username, password: hashedPassword })
    resp.status(201).send({ message: 'User registered successfully!' });
});

router.post('/login', async (req, resp) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return resp.status(400).send({ message: 'Username and password is required!' })
    }
    const existingUser = users.find(user => user.username === username);
    if (!existingUser) {
        return resp.status(400).send({ message: 'User is not registered!' })
    }
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
        return resp.status(400).send({ message: 'Password is invalid' })
    }

    const token = jwt.sign({ username: existingUser.username }, config.secret, { expiresIn: '1h' });
    resp.send({ token });
});

router.get('/test', authMiddleware, async (req, resp) => {
    resp.send({ message: 'This api endpoint is protected by jwt' })
})

module.exports = router;