const jwt = require('jsonwebtoken');
const config = require('../config');

function authMiddleware(req, res, next) {
    const header = req.header('Authorization');

    if (!header) {
        return res.status(401).json({ message: 'Access denied, no token provided!' });
    }

    const token = header.replace('Bearer ', '');

    try {
        const decodedUser = jwt.verify(token, config.secret);
        req.user = decodedUser;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Token is not valid or it is expired" });
    }
}

module.exports = authMiddleware;