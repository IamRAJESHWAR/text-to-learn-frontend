// Example of a protected route using Auth0 middleware
const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');

// Protected route example
router.get('/protected', checkJwt, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.auth });
});

// Debug: returns token claims for the current user
router.get('/me', checkJwt, (req, res) => {
  res.json({ user: req.auth });
});

module.exports = router;
