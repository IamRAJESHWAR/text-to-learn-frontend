const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const {
	listExamQuestions,
	createExamQuestion,
	getExamSyllabusHandler,
	generateExamCourse,
} = require('../controllers/examController');

// GET /api/exams/questions?exam=JEE_MAIN&stream=MPC&subject=Physics&year=2022&q=kinematics
router.get('/exams/questions', checkJwt, listExamQuestions);

// POST /api/exams/questions
router.post('/exams/questions', checkJwt, createExamQuestion);

// GET /api/exams/:examKey/syllabus
router.get('/exams/:examKey/syllabus', checkJwt, getExamSyllabusHandler);

// POST /api/exams/:examKey/generate-course
router.post('/exams/:examKey/generate-course', checkJwt, generateExamCourse);

module.exports = router;
