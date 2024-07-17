const mongoose = require('mongoose');

const githubSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    displayName: {
        type: String,
    },
    username: {
        type: String,
    },
    profileUrl: {
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

const GithubUser = mongoose.model('github-user', githubSchema);

module.exports = GithubUser;