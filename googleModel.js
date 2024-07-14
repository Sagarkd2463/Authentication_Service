const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    displayName: {
        type: String,
    },
    photo: {
        type: String,
    },
    provider: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const GoogleUser = mongoose.model('google-user', googleSchema);

module.exports = GoogleUser;