const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    let errors = {email: '', password: ''};

    if(err.code === 11000){
        errors.email = 'Email is already registered, please enter a new email!';
        return errors;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const timeLimit = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'alexander the great', {
        expiresIn: timeLimit,
    });
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signup_post = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const user = await User.create({ name, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, timeLimit: timeLimit * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    
}