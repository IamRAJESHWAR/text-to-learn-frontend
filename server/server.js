// Entry point for the backend application
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Declared once here
const dotenv = require('dotenv');
const path = require('path');

const app = express();

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// Middleware setup
app.use(cors({
  origin: 'https://text-to-learn-frontend.vercel.app',
  credentials: true
}));

app.use(express.json());

// Database connection
const connectDB = require('./config/db');
connectDB();

// API routes
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const hinglishRoutes = require('./routes/hinglish');
const youtubeRoutes = require('./routes/youtube');
const protectedRoutes = require('./routes/protected');
const examRoutes = require('./routes/exams');
const askRoutes = require('./routes/ask');
const examPaperRoutes = require('./routes/examPapers');

app.use('/api', courseRoutes);
app.use('/api', lessonRoutes);
app.use('/api', hinglishRoutes);
app.use('/api', youtubeRoutes);
app.use('/api/protected', protectedRoutes); // Common practice to nest protected routes
app.use('/api', examRoutes);
app.use('/api', askRoutes);
app.use('/api', examPaperRoutes);

// Serve uploaded papers
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Text-to-Learn Backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
