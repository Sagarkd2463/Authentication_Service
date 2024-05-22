const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authenticate');

const app = express();

app.use(express.static('public'));
app.use(authRoutes);

app.set('view engine', 'ejs');

const dbURI = `mongodb+srv://deshpandesagar15613:oGzEbxyvGaJazNDD@authentication.pvbaqd7.mongodb.net/?retryWrites=true&w=majority&appName=Authentication`;

mongoose.connect(dbURI)
.then(() => {
    console.log("DB Connected Successfully...");
})
.catch((err) => {
    console.log(err);
});

const PORT = 5000 || process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Listening on server port: ${PORT}`);
});

