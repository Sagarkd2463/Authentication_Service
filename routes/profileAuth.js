const express = require('express');
const profileRouter = express.Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/login');
    } else {
        next();
    }
};

profileRouter.get('/', authCheck, (req, res) => {
    res.send('You are logged in, this is your profile - ', req.user.username);
});


module.exports = profileRouter;