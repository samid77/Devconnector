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
/** End of Database configuration */

/** Routes configuration */
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

/** End of Routes configuration */

const port = process.env.PORT || 8008;
app.listen(port, () => {
    console.log(`Server started at port ${port}...`);
})
