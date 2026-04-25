// Course Controller — handles course generation and CRUD
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { generateCourse } = require('../services/geminiService');

/**
 * POST /api/courses/generate
 * Body: { topic: string }
 * Generates a full course outline using Gemini AI and saves to MongoDB.
 */
async function generateAndSaveCourse(req, res) {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  try {
    // Call Gemini AI to generate course structure
    const aiCourse = await generateCourse(topic);

    // Save the Course document
    const course = await Course.create({
      title: aiCourse.title,
      description: aiCourse.description,
      tags: aiCourse.tags || [],
      creator: req.auth?.sub || 'anonymous',
    });

    // Save each Module and its skeleton Lessons
    const moduleIds = [];
    for (const mod of aiCourse.modules) {
      const lessonIds = [];
      for (const lessonTitle of mod.lessons) {
        const lesson = await Lesson.create({
          title: lessonTitle,
          content: [],       // content will be populated when user opens the lesson
          isEnriched: false,
        });
        lessonIds.push(lesson._id);
      }

      const module = await Module.create({
        title: mod.title,
        course: course._id,
        lessons: lessonIds,
      });

      // Link lessons back to their module
      await Lesson.updateMany({ _id: { $in: lessonIds } }, { module: module._id });
      moduleIds.push(module._id);
    }

    // Link modules to course
    course.modules = moduleIds;
    await course.save();

    // Return fully populated course
    const populated = await Course.findById(course._id)
      .populate({ path: 'modules', populate: { path: 'lessons' } });

    res.status(201).json(populated);
  } catch (err) {
    console.error('generateAndSaveCourse error:', err.message);
    res.status(500).json({ error: 'Course generation failed', details: err.message });
  }
}

/**
 * GET /api/courses
 * Returns all courses for the authenticated user.
 */
async function getUserCourses(req, res) {
  try {
    const creator = req.auth?.sub || 'anonymous';
    const courses = await Course.find({ creator }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
}

/**
 * GET /api/courses/:courseId
 * Returns a single course with all modules and lessons populated.
 */
async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate({ path: 'modules', populate: { path: 'lessons' } });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course', details: err.message });
  }
}

/**
 * DELETE /api/courses/:courseId
 * Deletes a course and all its modules/lessons.
 */
async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate({ path: 'modules', populate: { path: 'lessons' } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    for (const mod of course.modules) {
      await Lesson.deleteMany({ _id: { $in: mod.lessons } });
      await Module.findByIdAndDelete(mod._id);
    }
    await Course.findByIdAndDelete(course._id);

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
}

module.exports = { generateAndSaveCourse, getUserCourses, getCourseById, deleteCourse };
