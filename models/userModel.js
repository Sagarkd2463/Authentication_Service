const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String, 
        required: [true, 'Please enter a password'],
        minLength: [8, 'Minimum password length should be 8 characters'],
        maxLength: 20
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;

