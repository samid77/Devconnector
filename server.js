const express = require('express');
const app = express();
const mongoose = require('mongoose');

/** Database configuration */
const db = require('./config/keys').mongoURI;
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => {
        console.log(`MongoDB connected...`)
    })
    .catch((err) => {
        console.log(err)
    })

const port = process.env.PORT || 8008;
app.listen(port, () => {
    console.log(`Server started at port ${port}...`);
})
