const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();
require('./database/db');

const app = express();
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

