import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL, getExamSyllabus, generateExamCourse, getYouTubeVideo, getExamPapers, uploadExamPaper } from '../utils/api';
import { getExamByKey } from '../data/exams';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ExamPage = () => {
  const { examKey } = useParams();
  const exam = useMemo(() => getExamByKey(examKey), [examKey]);
  const { isAuthenticated, getToken, loginWithRedirect } = useAuth();
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [papers, setPapers] = useState([]);
  const [myPapers, setMyPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lectureQuery, setLectureQuery] = useState('');
  const [lectureUrl, setLectureUrl] = useState('');
  const [lectureLoading, setLectureLoading] = useState(false);
  const [syllabus, setSyllabus] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);

  useEffect(() => {
    async function loadSyllabus() {
      if (!isAuthenticated) return;
      try {
        const token = await getToken();
        const data = await getExamSyllabus(examKey, token);
        setSyllabus(data);
      } catch {
        setSyllabus(null);
      }
    }
    loadSyllabus();
  }, [examKey, getToken, isAuthenticated]);

  const handleFetchPapers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const params = { exam: exam.exam };
      if (year.trim()) params.year = year.trim();
      const data = await getExamPapers(params, token, true);
      setPapers(data.approved || []);
      setMyPapers(data.mine || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch papers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    handleFetchPapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examKey, isAuthenticated]);

  if (!exam) return <ErrorMessage message="Exam not found." />;
  if (!isAuthenticated) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 8 }}>{exam.name}</h2>
        <p style={{ marginBottom: 16 }}>Please log in to access exam content.</p>
        <button onClick={() => loginWithRedirect()}>Log In</button>
      </div>
    );
  }

  const handleLectureSearch = async () => {
    setLectureLoading(true);
    setLectureUrl('');
    try {
      const q = `${exam.name} ${lectureQuery || 'full course'} playlist`;
      const url = await getYouTubeVideo(q);
      setLectureUrl(url);
    } finally {
      setLectureLoading(false);
    }
  };

  const handleGenerateCourse = async () => {
    setCourseLoading(true);
    try {
      const token = await getToken();
      const course = await generateExamCourse(examKey, token);
      window.location.href = `/courses/${course._id}`;
    } finally {
      setCourseLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 6 }}>{exam.name}</h1>
        <p style={{ color: '#64748b' }}>{exam.description}</p>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleGenerateCourse} disabled={courseLoading}>
            {courseLoading ? 'Generating Course...' : 'Generate Full Course'}
          </button>
        </div>
      </div>

      {syllabus && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Syllabus (Start to End)</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {syllabus.modules?.map((mod, idx) => (
              <div key={idx} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <strong>{mod.title}</strong>
                <ul style={{ marginTop: 6 }}>
                  {mod.lessons?.map((lesson, lIdx) => (
                    <li key={lIdx}>{lesson}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Previous Year Papers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
          <input placeholder="Year (e.g., 2022)" value={year} onChange={e => setYear(e.target.value)} />
          <button onClick={handleFetchPapers} disabled={loading}>Search</button>
        </div>

        <div style={{ marginBottom: 16, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <h4 style={{ marginBottom: 8 }}>Upload Paper (Pending Approval)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <input placeholder="Caption / Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input placeholder="Year (required)" value={year} onChange={e => setYear(e.target.value)} />
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
            <button
              onClick={async () => {
                if (!title.trim() || !year.trim() || !file) {
                  setError('Title, year, and file are required.');
                  return;
                }
                try {
                  const token = await getToken();
                  await uploadExamPaper({ exam: exam.exam, year, title, file }, token);
                  setTitle('');
                  setFile(null);
                  handleFetchPapers();
                } catch (err) {
                  setError(err.response?.data?.error || 'Failed to upload paper.');
                }
              }}
            >
              Upload
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner message="Loading papers..." />}
        {error && <ErrorMessage message={error} />}
        {!loading && papers.length === 0 && (
          <div style={{ color: '#64748b' }}>No approved papers found for this filter.</div>
        )}

        {myPapers.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, color: '#64748b' }}>Your uploads (pending approval)</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {myPapers.map((paper, idx) => (
                <div key={paper._id || idx} className="card" style={{ background: '#fff7ed' }}>
                  <div style={{ fontWeight: 600 }}>{paper.title}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>{paper.year}</div>
                  <a href={`${API_BASE_URL}${paper.fileUrl}`} target="_blank" rel="noreferrer">Open Paper</a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          {papers.map((paper, idx) => (
            <div key={paper._id || idx} className="card" style={{ background: '#f8fafc' }}>
              <div style={{ fontWeight: 600 }}>{paper.title}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>{paper.year}</div>
              <a href={`${API_BASE_URL}${paper.fileUrl}`} target="_blank" rel="noreferrer">Open Paper</a>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Lectures</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <input
            placeholder="Search lecture topic (e.g., Kinematics)"
            value={lectureQuery}
            onChange={e => setLectureQuery(e.target.value)}
          />
          <button onClick={handleLectureSearch} disabled={lectureLoading}>
            {lectureLoading ? 'Searching...' : 'Find Lecture'}
          </button>
        </div>
        {lectureUrl && (
          <div style={{ aspectRatio: '16 / 9' }}>
            <iframe
              title="Lecture"
              src={lectureUrl}
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 0, borderRadius: 8 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
