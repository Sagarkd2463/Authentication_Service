const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authenticate');

const app = express();

app.use(express.static('public'));
app.use(express.json());

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

const PORT = 5000 || process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Listening on server port: ${PORT}`);
});

