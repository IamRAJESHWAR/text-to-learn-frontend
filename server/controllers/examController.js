const ExamQuestion = require('../models/ExamQuestion');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { getExamSyllabus } = require('../data/examSyllabus');
const { generateExamMetadata } = require('../services/geminiService');

async function listExamQuestions(req, res) {
  try {
    const { exam, stream, subject, year, q, limit = 50 } = req.query;
    const filter = {};

    if (exam) filter.exam = exam;
    if (stream) filter.stream = stream;
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (year) filter.year = Number(year);
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ question: regex }, { solution: regex }, { tags: regex }];
    }

    const questions = await ExamQuestion.find(filter)
      .sort({ year: -1 })
      .limit(Math.min(Number(limit) || 50, 200))
      .lean();

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
  }
}

async function createExamQuestion(req, res) {
  try {
    const question = await ExamQuestion.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create question', details: err.message });
  }
}

async function getExamSyllabusHandler(req, res) {
  const syllabus = getExamSyllabus(req.params.examKey);
  if (!syllabus) return res.status(404).json({ error: 'Exam syllabus not found' });
  res.json(syllabus);
}

async function generateExamCourse(req, res) {
  try {
    const syllabus = getExamSyllabus(req.params.examKey);
    if (!syllabus) return res.status(404).json({ error: 'Exam syllabus not found' });

    let metadata = null;
    try {
      metadata = await generateExamMetadata(syllabus.name, syllabus.modules);
    } catch {
      metadata = null;
    }

    const course = await Course.create({
      title: metadata?.title || `${syllabus.name} Complete Course`,
      description: metadata?.description || `Full syllabus coverage for ${syllabus.name}.`,
      tags: metadata?.tags || [syllabus.exam, syllabus.stream],
      creator: req.auth?.sub || 'anonymous',
    });

    const moduleIds = [];
    for (const mod of syllabus.modules) {
      const lessonIds = [];
      for (const lessonTitle of mod.lessons) {
        const lesson = await Lesson.create({
          title: lessonTitle,
          content: [],
          isEnriched: false,
        });
        lessonIds.push(lesson._id);
      }

      const module = await Module.create({
        title: mod.title,
        course: course._id,
        lessons: lessonIds,
      });

      await Lesson.updateMany({ _id: { $in: lessonIds } }, { module: module._id });
      moduleIds.push(module._id);
    }

    course.modules = moduleIds;
    await course.save();

    const populated = await Course.findById(course._id)
      .populate({ path: 'modules', populate: { path: 'lessons' } });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate exam course', details: err.message });
  }
}

module.exports = {
  listExamQuestions,
  createExamQuestion,
  getExamSyllabusHandler,
  generateExamCourse,
};
