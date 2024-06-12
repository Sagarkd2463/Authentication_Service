require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

//Authentication routes 
const authRoutes = require('./routes/authenticate');
const profileRoutes = require('./routes/profileAuth');
const googleRoutes = require('./routes/partialRoutes/googleRoutes');
const githubRoutes = require('./routes/partialRoutes/googleRoutes');
const facebookRoutes = require('./routes/partialRoutes/facebookRoutes');
const linkedinRoutes = require('./routes/partialRoutes/linkedinRoutes');

const cookieParser = require('cookie-parser');
const { requireAuth, checkCurrentUser } = require('./middleware/authMiddleware');

//Passport login routes
const passportSetup = require('./config/passport-setup-google');
const passport = require('passport');
const linkedinStrat = require('./config/passport-setup-linkedin');
const facebookStrat = require('./config/passport-setup-facebook');
const githubStrat = require('./config/passport-setup-github');
const googleStrat = require('./config/passport-setup-google');

const cookieSession = require('cookie-session');
const sessionExpress = require('express-session');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cors());
app.use(cookieParser());
app.use(cookieSession({
    session: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION]
}));

app.use(sessionExpress({
    secret: process.env.ESESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
})
);

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
app.get('/', requireAuth, (req, res) => {
    res.render('home', { user: req.user });
});

app.use('/', authRoutes);
app.use('/auth', profileRoutes);
app.use('/auth/google', googleRoutes);
app.use('/auth/github', githubRoutes);
app.use('/auth/facebook', facebookRoutes);
app.use('/auth/linkedin', linkedinRoutes);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening on server port: ${PORT}`);
});

