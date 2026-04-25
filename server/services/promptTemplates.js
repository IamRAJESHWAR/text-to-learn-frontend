// AI prompt templates for course and lesson generation

function generateCoursePrompt(topic) {
  return `You are an expert course designer. Given the topic: "${topic}", generate a JSON object with the following structure:
{
  "title": string, // course title
  "description": string, // course description
  "tags": [string], // relevant tags
  "modules": [
    {
      "title": string, // module title
      "lessons": [string] // lesson titles
    }
  ]
}
- The curriculum should progress from foundational to advanced concepts.
- Ensure 3-6 modules, each with 3-5 lessons.
- Return only valid JSON, no markdown or extra text.`;
}

function generateLessonPrompt(course, module, lesson) {
  return `You are an expert educator. Given the course: "${course}", module: "${module}", and lesson: "${lesson}", generate a JSON object with:
{
  "title": string, // lesson title
  "objectives": [string], // lesson objectives
  "content": [
    { "type": "heading", "text": string },
    { "type": "paragraph", "text": string },
    { "type": "code", "language": string, "text": string },
    { "type": "video", "query": string },
    { "type": "mcq", "question": string, "options": [string], "answer": number, "explanation": string }
  ]
}
- Include a structured objectives field.
- Use a video search query, not a direct link.
- Add a code block only if relevant.
- Add 4-5 MCQs at the end, each with an explanation.
- Return only valid JSON, no markdown or extra text.`;
}

function generateExamMetadataPrompt(examName, modules) {
  return `You are an exam course designer. Given the exam name "${examName}" and the syllabus modules/lessons below, return ONLY a JSON object with:
{
  "title": string,
  "description": string,
  "tags": [string]
}

Syllabus:
${JSON.stringify(modules)}

Rules:
- Keep the title concise and exam-focused.
- Description should mention full syllabus coverage with topic-wise lessons.
- 5-8 short tags. Return valid JSON only.`;
}

function generateMoreQuizPrompt(lessonTitle, existingCount) {
  return `You are an expert educator. Create 5 additional MCQs for the lesson titled "${lessonTitle}".
Return ONLY a JSON object with:
{
  "mcqs": [
    { "type": "mcq", "question": string, "options": [string], "answer": number, "explanation": string }
  ]
}

Rules:
- Do NOT repeat any of the previous questions.
- Focus on key concepts, edge cases, and exam-style reasoning.
- Keep options concise and unambiguous.
- Return valid JSON only. Existing MCQ count: ${existingCount}.
`;
}

module.exports = {
  generateCoursePrompt,
  generateLessonPrompt,
  generateExamMetadataPrompt,
  generateMoreQuizPrompt,
};
