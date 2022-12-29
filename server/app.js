const express = require('express');
var cors = require('cors')
const path = require('path');
const logger = require('morgan');

const authenticationRouter = require('./routes/authentication');
const assignmentsRouter = require('./routes/assignments');
const subjectsRouter = require('./routes/subjects');
const teachersRouter = require('./routes/teachers');

const authenticationMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');

const PopulateUtil = require('./util/populate');

const fileUpload = require('express-fileupload');

const mongoose = require("mongoose");

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authenticationMiddleware);

app.use('/auth', authenticationRouter);
app.use('/assignments', assignmentsRouter);
app.use('/subjects', subjectsRouter);
app.use('/teachers', teachersRouter);

app.use(errorMiddleware);

console.log(process.env.MONGO_URL);
console.log(process.env.PASSWORD_HASH_KEY);
console.log(process.env.TOKEN_SIGNATURE_KEY);

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/assignment', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        PopulateUtil.populate().then(() => {
            console.log('Populated MongoDB');
        });
    }).catch(err => {
        console.error(err);
    });

module.exports = app;