const mongoose = require('mongoose');

const facebookSchema = new mongoose.Schema({
    facebookId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    gender: {
        type: String,
    },
    email: {
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

const FacebookUser = mongoose.model('facebook-user', facebookSchema);

module.exports = FacebookUser;