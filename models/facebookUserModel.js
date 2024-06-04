const mongoose  = require('mongoose');

const facebookUserSchema = new mongoose.Schema({});

const FacebookUser = mongoose.model('facebookuser', facebookUserSchema);

module.exports = FacebookUser;