// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/authenticate');
// const bodyParser = require('body-parser');

// const app = express();

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(bodyParser.json());

// app.set('view engine', 'ejs');

// app.use('/api/auth', authRoutes);

// const dbURI = process.env.DATABASEURL;

// mongoose.connect(dbURI)
//     .then(() => {
//         console.log("DB Connected Successfully...");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

const express = require('express');
const authRoutes = require('./routes/authenticate');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use('/', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on server port: http://localhost:${PORT}`);
});

