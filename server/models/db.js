const mongoose = require('mongoose');
const role = require('./role');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    passwordHash: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    roles: {
        type: [Number],
        default: [role.CREATE_ASSIGMENT, role.UPDATE_ASSIGMENT]
    }
});
const User = mongoose.model('User', UserSchema);

const AssigmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    }
});
const Assigment = mongoose.model('Assigment', AssigmentSchema);

module.exports = { User, Assigment };