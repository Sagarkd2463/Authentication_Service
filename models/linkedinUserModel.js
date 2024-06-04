const mongoose = require('mongoose');

const linkedinUserSchema = new mongoose.Schema({});

const LinkedinUser = mongoose.model('linkedinuser', linkedinUserSchema);

module.exports = LinkedinUser;