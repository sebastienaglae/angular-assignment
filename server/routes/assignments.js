const express = require('express');
const fs = require('fs');
const router = express.Router();

const AssignmentService = require('../services/assignment');
const SubjectService = require('../services/subject');
const TeacherService = require('../services/teacher');

const Role = require('../models/role');
const { AuthenticationRequiredError, AuthorizationError, ObjectNotFoundError } = require("../models/error");
const { StringLengthValidator, NumberValidator, ObjectIdValidator, DateTimeValidator } = require('../util/validator');
const { AssignmentDto, AssignmentInfoDto, AssignmentRatingDto, AssignmentSubmissionDto } = require("../models/dto/assignment");

router.get('/search', async (req, res, next) => {
    try {
        const { filter = '{}', order = '{}', page = 1, limit = 10 } = req.query;
        NumberValidator('page', page, 1);
        NumberValidator('limit', limit, 1, AssignmentService.maxSearchLimit);

        const options = {
            filter: JSON.parse(filter),
            order: JSON.parse(order),
            page: page,
            limit: limit,
        };
        const searchResult = await AssignmentService.search(options);

        searchResult.items = searchResult.items.map(AssignmentInfoDto);

        res.json(searchResult);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        if (!req.auth) {
            throw new AuthenticationRequiredError();
        }
        if (!req.auth.hasRole(Role.DELETE_ASSIGNMENT)) {
            throw new AuthorizationError('Only admins can delete assignments');
        }

        const { id } = req.params;
        ObjectIdValidator('id', id);

        const success = await AssignmentService.delete(id);

        res.json({ success });
    } catch (error) {
        next(error);
    }
});

router.put('/:id/info', async (req, res, next) => {
    try {
        if (!req.auth) {
            throw new AuthenticationRequiredError();
        }
        if (!req.auth.hasRole(Role.UPDATE_ASSIGNMENT)) {
            throw new AuthorizationError('Only admins can update assignments');
        }

        const { id } = req.params;
        ObjectIdValidator('id', id);

        const { subjectId, teacherId, title, description, dueDate } = req.body;
        AssignmentPropertyValidator(subjectId, teacherId, title, description, dueDate);

        if (!await SubjectService.exists(subjectId)) {
            throw new ObjectNotFoundError('Subject not found');
        }
        if (!await TeacherService.exists(teacherId)) {
            throw new ObjectNotFoundError('Teacher not found');
        }

        const success = await AssignmentService.updateInformation(id, subjectId, title, description, dueDate);

        res.json({ success });
    } catch (error) {
        next(error);
    }
});

router.put('/:id/submission', async (req, res, next) => {
    try {
        if (!req.auth) {
            throw new AuthenticationRequiredError();
        }
        if (!req.auth.hasRole(Role.UPDATE_ASSIGNMENT)) {
            throw new AuthorizationError('Only admins can update assignments');
        }

        const { id } = req.params;
        ObjectIdValidator('id', id);

        const file = req.files.submission;
        const { mimetype, name, tempFilePath, size } = file;
        StringLengthValidator('name', name, 1, 255);
        NumberValidator('size', size, 1, AssignmentService.maxSubmissionSize);

        // open the file and read the content
        const submission = fs.readFileSync(tempFilePath);
        const success = await AssignmentService.updateSubmission(id, { type: mimetype, originalName: name, content: submission });

        res.json({ success });
    } catch (error) {
        next(error);
    }
});

router.put('/:id/rating', async (req, res, next) => {
    try {
        if (!req.auth) {
            throw new AuthenticationRequiredError();
        }
        if (!req.auth.hasRole(Role.UPDATE_ASSIGNMENT)) {
            throw new AuthorizationError('Only admins can update assignments');
        }

        const { id } = req.params;
        ObjectIdValidator('id', id);

        const { rating, comment = '' } = req.body;
        NumberValidator('rating', rating, 0);
        StringLengthValidator('comment', comment, 0, 1000);

        const success = await AssignmentService.updateRating(id, { rating, comment });

        res.json({ success });
    } catch (error) {
        next(error);
    }
});

router.get('/:id/info', async (req, res, next) => {
    try {
        const { id } = req.params;
        ObjectIdValidator('id', id);

        const result = await AssignmentService.find(id);

        if (!result) {
            throw new ObjectNotFoundError('Assignment not found');
        }

        res.json(AssignmentInfoDto(result));
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        ObjectIdValidator('id', id);

        const result = await AssignmentService.find(id);

        if (!result) {
            throw new ObjectNotFoundError('Assignment not found');
        }

        res.json(AssignmentDto(result));
    } catch (error) {
        next(error);
    }
});

router.get('/:id/submission', async (req, res, next) => {
    try {
        const { id } = req.params;
        ObjectIdValidator('id', id);

        const result = await AssignmentService.find(id);

        if (!result) {
            throw new ObjectNotFoundError('Assignment not found');
        }

        res.json(result.submission ? AssignmentSubmissionDto(result) : null);
    } catch (error) {
        next(error);
    }
});

router.get('/:id/rating', async (req, res, next) => {
    try {
        const { id } = req.params;
        ObjectIdValidator('id', id);

        const result = await AssignmentService.find(id);

        if (!result) {
            throw new ObjectNotFoundError('Assignment not found');
        }

        res.json(result.rating ? AssignmentRatingDto(result) : null);
    } catch (error) {
        next(error);
    }
});

router.post('/create', async (req, res, next) => {
    try {
        if (!req.auth) {
            throw new AuthenticationRequiredError();
        }
        if (!req.auth.hasRole(Role.CREATE_ASSIGNMENT)) {
            throw new AuthorizationError('Only admins can update assignments');
        }

        const { subjectId, teacherId, title, description, dueDate } = req.body;
        AssignmentPropertyValidator(subjectId, teacherId, title, description, dueDate);

        if (!await SubjectService.exists(subjectId)) {
            throw new ObjectNotFoundError('Subject not found');
        }
        if (!await TeacherService.exists(teacherId)) {
            throw new ObjectNotFoundError('Teacher not found');
        }

        const ownerId = req.auth.id;
        const assignment = await AssignmentService.create(ownerId, subjectId, teacherId, title, description, dueDate);

        res.json(AssignmentDto(assignment));
    } catch (error) {
        next(error);
    }
});

const AssignmentPropertyValidator = (subjectId, teacherId, title, description, dueDate) => {
    ObjectIdValidator('subjectId', subjectId);
    ObjectIdValidator('teacherId', teacherId);
    StringLengthValidator('title', title, 1, 100);
    StringLengthValidator('description', description, 1, 50000);
    DateTimeValidator('dueDate', dueDate);
}

module.exports = router;