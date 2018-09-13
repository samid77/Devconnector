/** Fundamentals configuration (Express) */
const express = require('express');
const app = express();

/** Body Parser Configuration */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Routes configuration */
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

/** Database configuration */
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

/** Passport configuration */
const passport = require('passport');
app.use(passport.initialize()); //Passport middleware
require('./config/passport')(passport);

/** Routes configuration */
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 8008;
app.listen(port, () => console.log(`Server running on port ${port}...`));
