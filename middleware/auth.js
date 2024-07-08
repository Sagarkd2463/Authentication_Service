const jwt = require('jsonwebtoken');
const config = require('../config');

function authMiddleware(req, res, next) {
    const header = req.header('Authorization');

    if (!header) {
        return res.status(401).send({ message: 'Access denied, no token provided!' });
    }

    const token = header.replace('Bearer ', '');

    try {
        const decodedUser = jwt.verify(token, config.secret);
        req.user = decodedUser;
        next();
    } catch (err) {
        return res.status(400).send({ message: err});
    }
}

module.exports = authMiddleware;