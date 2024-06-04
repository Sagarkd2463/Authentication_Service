const mongoose = require('mongoose');

const githubUserSchema = new mongoose.Schema({
    githubId:{
        type: String
    },

    username: {
        type: String,
    },

    userUrl: {
        type: String
    },

    thumbnail: {
        type: String
    },

    origin: {
        type: String
    }
});

const GitHubUser = mongoose.model('githubuser', githubUserSchema);

module.exports = GitHubUser;