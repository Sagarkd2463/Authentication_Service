const mongoose = require('mongoose');

const linkedinUserSchema = new mongoose.Schema({
    linkedinId: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    thumbnail: {
        type: String
    },
    origin: {
        type: String
    }
});

const LinkedinUser = mongoose.model('linkedinuser', linkedinUserSchema);

module.exports = LinkedinUser;