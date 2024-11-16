const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;

