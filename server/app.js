const express = require('express');
const path = require('path');
const logger = require('morgan');

const authenticationRouter = require('./routes/authentication');
const assignmentsRouter = require('./routes/assignments');

const authenticationMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');

const mongoose = require("mongoose");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authenticationMiddleware);

app.use('/auth', authenticationRouter);
app.use('/assignments', assignmentsRouter);

app.use(errorMiddleware);

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/assignment', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error(err);
    });

module.exports = app;