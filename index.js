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
const GUser = require('./models/googleModel');
const GitUser = require('./models/githubModel');

// passport files 
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.use('/', authRoutes);

app.get('/success', (req, res) => {

    res.render('facebookDashboard', { user: req.user });
});

app.use(session({
    secret: process.env.ESESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

passport.use(new GoogleStrategy({
    clientID: "274907625225-pnsmk781m0hqlkagrr6qf7ae35pnv7ar.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(null, profile);
        return done(null, profile);
    }
));

passport.use(new FacebookStrategy({
    clientID: "453285177505178",
    clientSecret: "c0f029cec353c95bc12817d6c534a503",
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'email', 'picture.type(large)']
},
    async function (accessToken, refreshToken, profile, done) {

        try {
            const user = await FUser.findOne({ 'id': profile.id });

            if (!user) return done(null, false);

            if (user) {
                console.log(" User Found ");
                console.log(user);
                return done(null, user);
            } else {
                const newUser = new FUser();

                newUser.id = profile.id;
                newUser.displayName = profile.displayName;
                newUser.gender = profile.gender;
                newUser.email = profile.emails[0].value;
                newUser.photo = profile.photos[0].value;
                newUser.provider = profile.provider;

                newUser.save(function (err) {
                    if (err) throw err;

                    return done(null, newUser);
                });
            }
        } catch (err) {
            return done(err, false);
        }
    }
));

passport.use(new GithubStrategy({
    clientID: "Ov23liw7G9MiknQ9yizk",
    clientSecret: "05625aefd470d70429ad6fbe55a0e81bde01b67f",
    callbackURL: "http://localhost:5000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(null, profile);
        return done(null, profile);
    }
));

passport.use(new LinkedinStrategy({
    clientID: "77te6ypqa2xqsw",
    clientSecret: "WPL_AP1.98ElCmbdVHQD8ELb.PF/oUQ==",
    callbackURL: "http://localhost:5000/auth/linkedin/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(null, profile);
        return done(null, profile);
    }
));

//Facebook 
passport.serializeUser(function (facebookuser, done) {
    done(null, facebookuser.id);
});

passport.deserializeUser(function (id, done) {
    FUser.findById(id, function (err, user) {
        done(err, user);
    });
});

//Google
passport.serializeUser(function (googleuser, done) {
    done(null, googleuser.id);
});

passport.deserializeUser(function (id, done) {
    GUser.findById(id, function (err, user) {
        done(err, user);
    });
});

//Github
passport.serializeUser(function (githubuser, done) {
    done(null, githubuser.id);
});

passport.deserializeUser(function (id, done) {
    GitUser.findById(id, function (err, user) {
        done(err, user);
    });
});

//Linkedin
passport.serializeUser(function (linkedinuser, done) {
    done(null, linkedinuser.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/', successRedirect: '/success' }),
);

app.get('/auth/github',
    passport.authenticate('github', { scope: 'email' })
);

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        res.render('githubDashboard', { user: req.user });
    }
);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.render('googleDashboard', { user: req.user });
    }
);

app.get('/auth/linkedin',
    passport.authenticate('linkedin', { scope: 'email' })
);

app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    function (req, res) {
        res.render('linkedinDashboard', { user: req.user });
    }
);

app.get('/auth/facebook/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/auth/google/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/auth/github/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

app.get('/auth/linkedin/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});

