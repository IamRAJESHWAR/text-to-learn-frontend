import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse, generateLessonContent, generateMoreQuiz } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import LessonRenderer from '../components/LessonRenderer';
import LessonPDFExporter from '../components/LessonPDFExporter';
import HinglishAudioButton from '../components/blocks/HinglishAudioButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LessonPage = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const { isAuthenticated, getToken, loginWithRedirect } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [mcqSelections, setMcqSelections] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const c = await getCourse(courseId);
        setCourse(c);
        const mod = c.modules[parseInt(moduleIndex, 10)];
        if (mod && mod.lessons) {
          setLesson(mod.lessons[parseInt(lessonIndex, 10)]);
        }
      } catch (err) {
        setError('Failed to load lesson data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId, moduleIndex, lessonIndex]);

  const handleGenerateContent = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    setGenerating(true);
    setError('');
    try {
      const token = await getToken();
      const updatedLesson = await generateLessonContent(lesson._id, token);
      setLesson(updatedLesson);
    } catch (err) {
      setError('Failed to generate rich lesson content.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateMoreQuiz = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    setQuizLoading(true);
    try {
      const token = await getToken();
      const updatedLesson = await generateMoreQuiz(lesson._id, token);
      setLesson(updatedLesson);
      setQuizChecked(false);
      setMcqSelections({});
    } catch (err) {
      setError('Failed to generate more quiz questions.');
    } finally {
      setQuizLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!lesson) return <ErrorMessage message="Lesson not found." />;
  const mcqBlocks = lesson.content?.filter(b => b.type === 'mcq') || [];
  const totalQuestions = mcqBlocks.length;
  const correctCount = (lesson.content || []).reduce((count, block, idx) => {
    if (block.type !== 'mcq') return count;
    const selected = mcqSelections[idx];
    const answerIndex = typeof block.answer === 'number' ? block.answer : block.options?.indexOf(block.answer);
    return selected !== undefined && selected === answerIndex ? count + 1 : count;
  }, 0);

  const handleMcqSelect = (index, selection) => {
    setMcqSelections(prev => ({ ...prev, [index]: selection }));
  };

  // Create full text for Hinglish TTS
  const fullText = lesson.content
    ?.filter(b => b.type === 'heading' || b.type === 'paragraph')
    .map(b => b.text)
    .join('. ');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
      <div style={{ marginBottom: 20 }}>
        <Link to={`/courses/${courseId}`} style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          ← Back to Course
        </Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-dark)', margin: 0 }}>{lesson.title}</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            {lesson.isEnriched && fullText && <HinglishAudioButton text={fullText} />}
            {lesson.isEnriched && (
              <LessonPDFExporter fileName={`${lesson.title}.pdf`}>
                <div style={{ padding: 40, fontFamily: 'Arial, sans-serif', fontSize: 12, lineHeight: 1.5, color: '#111' }}>
                  <h1 style={{ margin: '0 0 16px', fontSize: 20, lineHeight: 1.3 }}>{lesson.title}</h1>
                  <LessonRenderer content={lesson.content} mode="pdf" />
                </div>
              </LessonPDFExporter>
            )}
          </div>
        </div>

        {!lesson.isEnriched ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>🎓</div>
            <h3 style={{ marginBottom: 10 }}>Content Not Generated Yet</h3>
            <p style={{ color: '#64748b', marginBottom: 20 }}>
              Click below to let AI generate the full rich lesson content.
            </p>
            {generating ? (
              <LoadingSpinner message="AI is writing your lesson..." />
            ) : (
              <button onClick={handleGenerateContent} style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
                Generate Lesson Content
              </button>
            )}
          </div>
        ) : (
          <div className="lesson-content">
            <LessonRenderer
              content={lesson.content}
              onMcqSelect={handleMcqSelect}
              mcqSelections={mcqSelections}
              showQuizResult={quizChecked}
            />
            {totalQuestions > 0 && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setQuizChecked(true)} disabled={quizChecked}>
                    Check Quiz
                  </button>
                  <button
                    onClick={() => {
                      setQuizChecked(false);
                      setMcqSelections({});
                    }}
                    disabled={!quizChecked}
                  >
                    Reset Quiz
                  </button>
                  {quizChecked && (
                    <strong>Quiz Result: {correctCount}/{totalQuestions}</strong>
                  )}
                  <button onClick={handleGenerateMoreQuiz} disabled={quizLoading}>
                    {quizLoading ? 'Generating Quiz...' : 'Generate More Quiz'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
