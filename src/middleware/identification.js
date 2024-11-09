const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) => {
    let token;

    if (req.headers.client === 'not-browser') {
        token = req.headers.authorization;
    } else {
        token = req.cookies['Authorization'];
    }

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized token!'
        });
    }

    try {
        const userToken = token.split(' ')[1];
        const verifyUser = jwt.verify(userToken, process.env.TOKEN_SECRET);

        if (!verifyUser) {
            throw new Error('Something went wrong. Please try again!');
        } else {
            req.user = verifyUser;
            next();
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};