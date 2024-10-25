require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');

// Initialize the app
const app = express();

// Database connection
require('./database/db'); // Ensure database connection loads before using models

// Import User model and Passport configurations
const User = require('./models/userModel');
const { initializingPassport, isAuthenticated } = require('./controllers/userPassport');

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
const { registeredUserValidate, loginUserValidate } = require('./middleware/validUser');

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

// Profile route, protected by authentication middleware
app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profileUser', { name: req.user.name, email: req.user.email });
});

// Registration route
app.post("/register", registeredUserValidate, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).redirect("/login");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login route with passport authentication
app.post("/login", passport.authenticate('local', {
    successRedirect: "/profile",
    successFlash: true,
    failureRedirect: "/register",
    failureFlash: true
}), loginUserValidate);

// Logout route
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Additional routes
app.use("/", successRoutes);
app.use("/", passportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});