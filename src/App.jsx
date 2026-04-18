import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import ExamPage from './pages/ExamPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="exams/:examKey" element={<ExamPage />} />
          <Route path="courses/:courseId" element={<CoursePage />} />
          <Route path="courses/:courseId/module/:moduleIndex/lesson/:lessonIndex" element={<LessonPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
