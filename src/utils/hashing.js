const bcrypt = require('bcryptjs');

const doHashPassword = async (userPassword) => {
    const saltRound = 10;
    return await bcrypt.hash(userPassword, saltRound);
};

const doComparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { doHashPassword, doComparePassword };