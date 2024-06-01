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
    res.render('profile', { user: req.user});
});

module.exports = profileRouter;