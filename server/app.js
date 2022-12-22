const express = require('express');
const path = require('path');
const logger = require('morgan');

const authenticationRouter = require('./routes/authentication');
const usersRouter = require('./routes/assigments');

const authenticationMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');

const mongoose = require("mongoose");

const main = async () => {
    const app = express();

    await mongoose.connect(process.env.MONGO_URL);

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(authenticationMiddleware);
    app.use(errorMiddleware);

    app.use('/auth', authenticationRouter);
    app.use('/users', usersRouter);

    module.exports = app;
}

main().catch(console.error);