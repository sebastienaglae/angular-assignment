const express = require('express');
const router = express.Router();

const AssignmentService = require('../services/assignment');
const Role = require('../models/role');
const {AuthenticationRequiredError,AuthorizationError} = require("../models/error");

router.get('/search', async (req, res, next) => {
    try {
      const { page, limit, order } = req.query;
      const options = {
          page: page || 1,
          limit: limit || 10,
          order: order || 'created-asc'
      };

      const searchResult = await AssignmentService.search(options);

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
      await AssignmentService.delete(id);

      res.json({ success: true });
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
        const { title, description, dueDate } = req.body;

        const success = await AssignmentService.update(id, title, description, dueDate);

        res.json({ success });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await AssignmentService.find(id);

        if (!result) {
            throw new ObjectNotFoundError('Assignment not found');
        }

        res.json({ result });
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
        throw new AuthenticationError('Only admins can update assignments');
      }

      const { title, description, dueDate } = req.body;
      const assignment = await AssignmentService.create(title, description, dueDate);

      res.json(assignment);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

class ObjectNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ObjectNotFoundError';
        this.code = 404;
    }
}