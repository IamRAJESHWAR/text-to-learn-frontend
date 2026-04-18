import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PromptForm from '../components/PromptForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { generateCourse, getUserCourses } from '../utils/api';
import { EXAM_CARDS } from '../data/exams';

const HomePage = () => {
  const { isAuthenticated, user, getToken, loginWithRedirect } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourses() {
      if (isAuthenticated) {
        try {
          const token = await getToken();
          const data = await getUserCourses(token);
          setCourses(data);
        } catch (err) {
          console.error(err);
        }
      }
    }
    loadCourses();
  }, [isAuthenticated, getToken]);

  const handleGenerateCourse = async (topic) => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const newCourse = await generateCourse(topic, token);
      navigate(`/courses/${newCourse._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20 }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>Text-to-Learn</h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>AI-Powered Course Generator</p>
      </div>

      <PromptForm onSubmit={handleGenerateCourse} isLoading={loading} />

      {loading && <LoadingSpinner message="Generating your personalized course structure..." />}
      {error && <ErrorMessage message={error} />}

      {isAuthenticated && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ marginBottom: 16 }}>Exam Prep Hub</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {EXAM_CARDS.map(card => (
              <Link key={card.key} to={`/exams/${card.key}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>{card.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isAuthenticated && courses.length > 0 && !loading && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ marginBottom: 20 }}>Your Courses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {courses.map(course => (
              <Link to={`/courses/${course._id}`} key={course._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ cursor: 'pointer', height: '100%', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: 10 }}>{course.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
