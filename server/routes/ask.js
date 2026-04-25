const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const { askAi } = require('../controllers/askController');

// POST /api/ask
router.post('/ask', checkJwt, askAi);

module.exports = router;
