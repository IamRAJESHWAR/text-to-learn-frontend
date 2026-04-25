// Gemini API integration for course and lesson generation
const axios = require('axios');
const {
  generateCoursePrompt,
  generateLessonPrompt,
  generateExamMetadataPrompt,
  generateMoreQuizPrompt,
} = require('./promptTemplates');

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

/**
 * Calls the Gemini API with a given prompt and returns parsed JSON.
 */
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const response = await axios.post(
      GEMINI_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: apiKey } }
    );
    const raw = response.data.candidates[0].content.parts[0].text;
    // Strip any accidental markdown code fences
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    const details = data ? JSON.stringify(data) : error.message;
    throw new Error(`Gemini API error${status ? ` (${status})` : ''}: ${details}`);
  }
}

async function callGeminiText(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const response = await axios.post(
      GEMINI_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: apiKey } }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    const details = data ? JSON.stringify(data) : error.message;
    throw new Error(`Gemini API error${status ? ` (${status})` : ''}: ${details}`);
  }
}

/**
 * Generates a full course outline (modules + lesson titles) for a topic.
 */
async function generateCourse(topic) {
  const prompt = generateCoursePrompt(topic);
  return callGemini(prompt);
}

/**
 * Generates detailed lesson content for a specific lesson.
 */
async function generateLesson(courseTitle, moduleTitle, lessonTitle) {
  const prompt = generateLessonPrompt(courseTitle, moduleTitle, lessonTitle);
  return callGemini(prompt);
}

/**
 * Generates title/description/tags for an exam syllabus.
 */
async function generateExamMetadata(examName, modules) {
  const prompt = generateExamMetadataPrompt(examName, modules);
  return callGemini(prompt);
}

/**
 * Generates additional MCQs for an existing lesson.
 */
async function generateMoreQuiz(lessonTitle, existingCount) {
  const prompt = generateMoreQuizPrompt(lessonTitle, existingCount);
  return callGemini(prompt);
}

/**
 * Generates a helpful answer for learner questions.
 */
async function generateAnswer(question, context) {
  const prompt = `You are a patient tutor. Answer the student's question clearly and step-by-step.\n\nQuestion:\n${question}\n\nContext (optional):\n${context || 'N/A'}\n\nRules:\n- Keep it concise but complete.\n- Use simple language and short paragraphs.\n- If a formula helps, include it.`;
  return callGeminiText(prompt);
}

module.exports = { generateCourse, generateLesson, generateExamMetadata, generateAnswer, generateMoreQuiz };
