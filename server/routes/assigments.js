const express = require('express');
const router = express.Router();

const AssigmentService = require('../services/assigment');
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

      const searchResult = await AssigmentService.search(options);

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
      if (!req.auth.hasRole(Role.DELETE_ASSIGMENT)) {
        throw new AuthorizationError('Only admins can delete assigments');
      }

      const { id } = req.params;
      await AssigmentService.delete(id);

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
        if (!req.auth.hasRole(Role.UPDATE_ASSIGMENT)) {
            throw new AuthorizationError('Only admins can update assigments');
        }

        const { id } = req.params;
        const { title, description, dueDate } = req.body;

        const success = await AssigmentService.update(id, title, description, dueDate);

        res.json({ success });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await AssigmentService.find(id);

        if (!result) {
            throw new ObjectNotFoundError('Assigment not found');
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
      if (!req.auth.hasRole(Role.CREATE_ASSIGMENT)) {
        throw new AuthenticationError('Only admins can update assigments');
      }

      const { title, description, dueDate } = req.body;
      const assigment = await AssigmentService.create(title, description, dueDate);

      res.json(assigment);
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