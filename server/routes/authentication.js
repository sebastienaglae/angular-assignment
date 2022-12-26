const express = require('express');
const router = express.Router();
const AuthenticationService = require('../services/authentication');

const {StringLengthValidator, EmailValidator} = require('../util/validator');

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await AuthenticationService.login(username, password);

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    StringLengthValidator('username', username, 4, 16);
    StringLengthValidator('password', password, 8);
    EmailValidator('email', email);

    await AuthenticationService.register(username, password, email);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
