const jwt = require('jsonwebtoken');

const generateToken = async (userId) => {
    return await jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "2d",
    });
};

module.exports = { generateToken };