const mongoose = require('mongoose');
const url = process.env.DATABASEURL;

mongoose.connect(url)
    .then(() => {
        console.log("Mongo DB Connected Successfully!!!");
    })
    .catch((err) => {
        console.log("No DB Connected", err);
    });

mongoose.set('bufferTimeoutMS', 20000); // 20 seconds