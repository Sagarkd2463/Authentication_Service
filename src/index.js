// Other requires
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const bcrypt = require('bcryptjs');

// Routes files
const successRoutes = require('./routes/success');
const passportRoutes = require('./routes/passportRoutes');

// Database files
require('./database/db');
const User = require('./models/userModel');

//middleware files
const { registeredUserValidate, loginUserValidate } = require('./middleware/validUser');

// Passport files
const passport = require('passport');
require('./controllers/googlePassport');
require('./controllers/facebookPassport');
require('./controllers/githubPassport');
require('./controllers/linkedinPassport');

// Express setup
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', registeredUserValidate, async (req, res) => {

    const user = await User.findOne({ username: req.body.username });

    if (user) return res.status(400).json({
        success: true,
        message: "User already exists!!",
        data: user,
    });

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    res.status(201).json({
        success: true,
        message: "New user created successfully!!!",
        data: newUser,
    });
});

app.post('/login', loginUserValidate, async (req, res) => {

});

app.use('/', successRoutes);
app.use('/', passportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});