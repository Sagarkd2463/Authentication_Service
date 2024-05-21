const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

const dbURI = "mongodb+srv://deshpandesagar15613:DvFetdrc7CFIdrZ8@cluster0.pyrmyxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Listening on server port: ${PORT}`);
});



