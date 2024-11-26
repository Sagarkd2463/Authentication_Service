const mongoose = require('mongoose');

const linkedinSchema = new mongoose.Schema({
    linkedinId: {
        type: String,
    },
    displayName: {
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
}, { timestamps: true });

const LinkedinUser = mongoose.model('linkedin-user', linkedinSchema);

module.exports = LinkedinUser;