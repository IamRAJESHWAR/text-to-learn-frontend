// API helper functions — all backend calls go through here
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Creates an axios instance with auth token injected automatically
export function createApiClient(token) {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// ── Course API ────────────────────────────────────────────────

export async function generateCourse(topic, token) {
  const api = createApiClient(token);
  const { data } = await api.post('/api/courses/generate', { topic });
  return data;
}

export async function getUserCourses(token) {
  const api = createApiClient(token);
  const { data } = await api.get('/api/courses');
  return data;
}

export async function getCourse(courseId) {
  const { data } = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
  return data;
}

export async function deleteCourse(courseId, token) {
  const api = createApiClient(token);
  const { data } = await api.delete(`/api/courses/${courseId}`);
  return data;
}

// ── Lesson API ────────────────────────────────────────────────

export async function getLesson(lessonId) {
  const { data } = await axios.get(`${API_BASE_URL}/api/lessons/${lessonId}`);
  return data;
}

export async function generateLessonContent(lessonId, token) {
  const api = createApiClient(token);
  const { data } = await api.post(`/api/lessons/${lessonId}/generate`);
  return data;
}

export async function generateMoreQuiz(lessonId, token) {
  const api = createApiClient(token);
  const { data } = await api.post(`/api/lessons/${lessonId}/more-quiz`);
  return data;
}

// ── Utility ───────────────────────────────────────────────────

export async function getYouTubeVideo(query) {
  const { data } = await axios.get(`${API_BASE_URL}/api/youtube`, { params: { query } });
  return data.url;
}

// ── Exams API ─────────────────────────────────────────────────

export async function getExamQuestions(params, token) {
  const api = createApiClient(token);
  const { data } = await api.get('/api/exams/questions', { params });
  return data;
}

export async function getExamSyllabus(examKey, token) {
  const api = createApiClient(token);
  const { data } = await api.get(`/api/exams/${examKey}/syllabus`);
  return data;
}

export async function generateExamCourse(examKey, token) {
  const api = createApiClient(token);
  const { data } = await api.post(`/api/exams/${examKey}/generate-course`);
  return data;
}

// ── Ask AI API ───────────────────────────────────────────────

export async function askAi(payload, token) {
  const api = createApiClient(token);
  const { data } = await api.post('/api/ask', payload);
  return data;
}

// ── Exam Papers API ──────────────────────────────────────────

export async function getExamPapers(params, token, includeMine = false) {
  const api = createApiClient(token);
  const { data } = await api.get('/api/exams/papers', {
    params: { ...params, includeMine },
  });
  return data;
}

export async function uploadExamPaper(payload, token) {
  const api = createApiClient(token);
  const formData = new FormData();
  formData.append('exam', payload.exam);
  formData.append('year', payload.year);
  formData.append('title', payload.title);
  formData.append('file', payload.file);
  const { data } = await api.post('/api/exams/papers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
