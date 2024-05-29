const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authenticate');
const cookieParser = require('cookie-parser');
const { requireAuth, checkCurrentUser } = require('./middleware/authMiddleware');

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

app.get('*', checkCurrentUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => {
    res.render('smoothies');
});

app.use('/auth', authRoutes);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Listening on server port: ${PORT}`);
});

