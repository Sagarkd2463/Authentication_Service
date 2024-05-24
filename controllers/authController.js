const User = require('../models/userModel');

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

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signup_post = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
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