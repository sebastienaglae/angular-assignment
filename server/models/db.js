const mongoose = require('mongoose');
const role = require('./role');

// Declare the schema of Account, which is used for the authentication of users
const AccountSchema = new mongoose.Schema({
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
        default: [role.CREATE_ASSIGNMENT, role.UPDATE_ASSIGNMENT]
    }
});
const Account = mongoose.model('Account', AccountSchema);

// Declare the schema of Subject, which is the Subject of an assignment (e.g. math, physics, etc.)
const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    iconUrl: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Subject = mongoose.model('Subject', SubjectSchema);

// Declare the schema of Teacher, which is the teacher of an assignment
const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    iconUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const Teacher = mongoose.model('Teacher', TeacherSchema);

// Declare the schema of Assignment, which is the assignment itself
const AssignmentSubmissionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    content: {
        type: Buffer,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
        required: true,
    }
});
const AssignmentRatingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,
        maxlength: 1000
    }
});
const AssignmentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },

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
    updatedAt: {
        type: Date
    },
    dueDate: {
        type: Date,
        required: true
    },
    submission: {
        type: AssignmentSubmissionSchema,
    },
    rating: {
        type: AssignmentRatingSchema
    }
});
const Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = { Account, Assignment, Subject, Teacher };