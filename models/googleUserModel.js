const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    googleId: {
        type: String
    },
    thumbnail: {
        type: String
    }
});

const GoogleUser = mongoose.model('googleuser', googleUserSchema);

module.exports = GoogleUser;