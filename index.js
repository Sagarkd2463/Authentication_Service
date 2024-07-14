require('dotenv').config();
// express files
const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// database fies
require('./database/db');
const FUser = require('./models/facebookModel');

// passport files 
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});
app.use('/', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});

