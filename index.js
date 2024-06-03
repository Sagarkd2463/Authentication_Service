require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authenticate');
const profileRoutes = require('./routes/profileAuth');
const cookieParser = require('cookie-parser');
const { requireAuth, checkCurrentUser } = require('./middleware/authMiddleware');

const passportSetup = require('./config/passport-setup-google');
const passport = require('passport');
const cookieSession = require('cookie-session');
const sessionExpress = require('express-session');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
    session: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION]
}));

app.use(sessionExpress({
    secret: process.env.ESESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

const dbURI = process.env.DATABASEURL;

mongoose.connect(dbURI)
    .then(() => {
        console.log("DB Connected Successfully...");
    })
    .catch((err) => {
        console.log(err);
    });

app.get('*', checkCurrentUser);
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});
app.get('/smoothies', requireAuth, (req, res) => {
    res.render('smoothies');
});

app.use('/', authRoutes);
app.use('/auth', profileRoutes);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on server port: ${PORT}`);
});

