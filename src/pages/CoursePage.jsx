import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse, deleteCourse } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getToken, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await getCourse(courseId);
        setCourse(data);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = await getToken();
        await deleteCourse(courseId, token);
        navigate('/');
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!course) return <ErrorMessage message="Course not found." />;

  const isOwner = isAuthenticated && user?.sub === course.creator;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
        <div>
          <h1 style={{ color: 'var(--primary-dark)', fontSize: '2rem' }}>{course.title}</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: 10 }}>{course.description}</p>
        </div>
        {isOwner && (
          <button onClick={handleDelete} style={{ backgroundColor: '#ef4444' }}>
            Delete Course
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
        {course.tags?.map((tag, idx) => (
          <span key={idx} style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 500 }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {course.modules?.map((mod, modIdx) => (
          <div key={mod._id} className="card" style={{ padding: '20px 24px' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: 10, marginBottom: 15 }}>
              Module {modIdx + 1}: {mod.title}
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mod.lessons?.map((lesson, lessonIdx) => (
                <li key={lesson._id}>
                  <Link 
                    to={`/courses/${courseId}/module/${modIdx}/lesson/${lessonIdx}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: 12, 
                      background: '#f8fafc', 
                      borderRadius: 8, 
                      color: 'var(--text-color)',
                      fontWeight: 500,
                      border: '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <span style={{ 
                      background: lesson.isEnriched ? '#10b981' : '#cbd5e1', 
                      color: '#fff', 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.8rem',
                      marginRight: 12 
                    }}>
                      {lesson.isEnriched ? '✓' : '-'}
                    </span>
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
