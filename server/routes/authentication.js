const express = require('express');
const router = express.Router();
const AuthenticationService = require('../services/authentication');

/* GET home page. */
router.get('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await AuthenticationService.login(username, password);

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.get('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    await AuthenticationService.register(username, password, email);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
