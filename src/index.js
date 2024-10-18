require('dotenv').config();

// Express files
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// Routes files
const authRoutes = require('./routes/authenticate');
const successRoutes = require('./routes/success');
const passportRoutes = require('./routes/passportRoutes');

// Database files
require('./database/db');
require('./models/userModel');

// Passport files
const passport = require('passport');
require('./controllers/googlePassport');
require('./controllers/facebookPassport');
require('./controllers/githubPassport');
require('./controllers/linkedinPassport');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.use('/', authRoutes);
app.use('/', successRoutes);
app.use('/', passportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});