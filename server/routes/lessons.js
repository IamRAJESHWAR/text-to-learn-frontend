// Lesson API Routes
const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const { generateAndSaveLesson, getLessonById, addMoreQuizQuestions } = require('../controllers/lessonController');

// GET /api/lessons/:lessonId          — get lesson content
router.get('/lessons/:lessonId', getLessonById);

// POST /api/lessons/:lessonId/generate — generate rich content for a lesson (protected)
router.post('/lessons/:lessonId/generate', checkJwt, generateAndSaveLesson);

// POST /api/lessons/:lessonId/more-quiz — add more MCQs (protected)
router.post('/lessons/:lessonId/more-quiz', checkJwt, addMoreQuizQuestions);

module.exports = router;
