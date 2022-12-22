const express = require('express');
const router = express.Router();

const { AssigmentService } = require('../services/assigment');
const Role = require('../models/role');
const {AuthenticationRequiredError,AuthenticationError} = require("../models/error");

/* GET users listing. */
router.get('/search', async (req, res, next) => {
  const { page, limit, order } = req.query;
  const options = {
      page: page || 1,
      limit: limit || 10,
      order: order || 'created-asc'
  };

  const searchResult = await AssigmentService.search(options);

  res.json(searchResult);
});

router.delete('/:id', async (req, res, next) => {
  if (!req.auth) {
    throw new AuthenticationRequiredError();
  }
  if (!req.auth.hasRole(Role.DELETE_ASSIGMENT)) {
    throw new AuthenticationError('Only admins can delete assigments');
  }

  const { id } = req.params;
  await AssigmentService.delete(id);

  res.json({ success: true });
});

router.put('/:id', async (req, res, next) => {
    if (!req.auth) {
        throw new AuthenticationRequiredError();
    }
    if (!req.auth.hasRole(Role.UPDATE_ASSIGMENT)) {
        throw new AuthenticationError('Only admins can update assigments');
    }

    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    const success = await AssigmentService.update(id, title, description, dueDate);

    res.json({ success });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await AssigmentService.find(id);

  res.json({ result });
});

router.post('/create', async (req, res, next) => {
  if (!req.auth) {
    throw new AuthenticationRequiredError();
  }
  if (!req.auth.hasRole(Role.CREATE_ASSIGMENT)) {
    throw new AuthenticationError('Only admins can update assigments');
  }

  const { title, description, dueDate } = req.body;
  const assigment = await AssigmentService.create(title, description, dueDate);

  res.json(assigment);
});

module.exports = router;
