// Course API Routes
const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const {
  generateAndSaveCourse,
  getUserCourses,
  getCourseById,
  deleteCourse,
} = require('../controllers/courseController');

// POST /api/courses/generate  — generate a course with AI (protected)
router.post('/courses/generate', checkJwt, generateAndSaveCourse);

// GET /api/courses            — get all courses for logged-in user (protected)
router.get('/courses', checkJwt, getUserCourses);

// GET /api/courses/:courseId  — get one course (public, for sharing)
router.get('/courses/:courseId', getCourseById);

// DELETE /api/courses/:courseId — delete a course (protected)
router.delete('/courses/:courseId', checkJwt, deleteCourse);

module.exports = router;
