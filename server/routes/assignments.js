const express = require('express');
const router = express.Router();

const AssignmentService = require('../services/assignment');
const SubjectService = require('../services/subject');

const Role = require('../models/role');
const {AuthenticationRequiredError,AuthorizationError,ObjectNotFoundError} = require("../models/error");
const {StringLengthValidator, NumberValidator, CustomValidator, ObjectIdValidator, DateTimeValidator} = require('../util/validator');
const {AssignmentDto} = require("../models/dto/assignment");

router.get('/search', async (req, res, next) => {
    try {
      const { page = 1, limit = 10, order = 'created-asc' } = req.query;

      NumberValidator('page', page, 1);
      NumberValidator('limit', limit, 1, AssignmentService.maxSearchLimit);
      CustomValidator('order', order, AssignmentService.isValidOrder);

      const options = {
          page: page,
          limit: limit,
          order: order
      };
      const searchResult = await AssignmentService.search(options);

      searchResult.items = searchResult.items.map(AssignmentDto);

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

router.put('/:id', async (req, res, next) => {
    try {
        if (!req.auth) {
            throw new AuthenticationRequiredError();
        }
        if (!req.auth.hasRole(Role.UPDATE_ASSIGNMENT)) {
            throw new AuthorizationError('Only admins can update assignments');
        }

        const { id } = req.params;
        ObjectIdValidator('id', id);

        const { subjectId, title, description, dueDate } = req.body;
        AssignmentPropertyValidator(title, description, dueDate);

        if (!await SubjectService.exists(subjectId)) {
            throw new ObjectNotFoundError('Subject not found');
        }

        const success = await AssignmentService.update(id, title, description, dueDate);

        res.json({ success });
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

router.post('/create', async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new AuthenticationRequiredError();
      }
      if (!req.auth.hasRole(Role.CREATE_ASSIGNMENT)) {
        throw new AuthorizationError('Only admins can update assignments');
      }

      const { subjectId, title, description, dueDate } = req.body;
      AssignmentPropertyValidator(title, description, dueDate);

      if (!await SubjectService.exists(subjectId)) {
          throw new ObjectNotFoundError('Subject not found');
      }

      const ownerId = req.auth.id;
      const assignment = await AssignmentService.create(ownerId, subjectId, title, description, dueDate);

      res.json(AssignmentDto(assignment));
    } catch (error) {
        next(error);
    }
});

const AssignmentPropertyValidator = (title, description, dueDate) => {
    StringLengthValidator('title', title, 1, 100);
    StringLengthValidator('description', description, 1, 50000);
    DateTimeValidator('dueDate', dueDate);
}

module.exports = router;