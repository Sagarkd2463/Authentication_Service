require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const passport = require('passport');
const flash = require('connect-flash');

// Initialize the app
const app = express();

// Database connection
require('./database/db'); // Ensure database connection loads before using models

// Import the passport 
const { initializingPassport } = require('./controllers/userPassport');

// Initialize Passport strategies
initializingPassport(passport);
require('./controllers/googlePassport');
require('./controllers/facebookPassport');
require('./controllers/githubPassport');
require('./controllers/linkedinPassport');

// Configure EJS as the template engine
app.set('view engine', 'ejs');

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure session middleware BEFORE initializing passport
app.use(session({
    secret: process.env.SESSION || 'yourSecretKey', // Provide a fallback if SESSION is undefined
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use secure: true in production with HTTPS
}));

// Configure flash middleware after session and before passport
app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const successRoutes = require('./routes/success');
const passportRoutes = require('./routes/passportRoutes');
const userRoutes = require('./routes/userRoute');

// Routes for pages
app.get("/", (req, res) => {
    res.render('home');
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get('/profile', (req, res) => {
    res.render('profileUser', { name: req.user.name, email: req.user.email });
});

// Additional routes
app.use("/", userRoutes);
app.use("/", successRoutes);
app.use("/", passportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});