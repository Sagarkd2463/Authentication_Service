const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authenticate');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

const dbURI = "mongodb+srv://deshpandesagar15613:oGzEbxyvGaJazNDD@authentication.pvbaqd7.mongodb.net/";

mongoose.connect(dbURI)
.then(() => {
    console.log("DB Connected Successfully...");
})
.catch((err) => {
    console.log(err);
});

app.get('/', (req, res) => res.render('home'));
app.use(authRoutes);

app.get('/set-cookies', (req, res) => {
    res.cookie('newUser', false);
    res.send('You got the cookies!');
});

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);

    res.json(cookies);
});

const PORT = 5000 || process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Listening on server port: ${PORT}`);
});

