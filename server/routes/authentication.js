const express = require('express');
const router = express.Router();
const AuthenticationService = require('../services/authentication');

/* GET home page. */
router.get('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const token = await AuthenticationService.login(username, password);

  res.json({ token });
});

router.get('/register', async (req, res, next) => {
  const { username, password, email } = req.body;
  await AuthenticationService.register(username, password, email);

  res.json({ success: true });
});

module.exports = router;
