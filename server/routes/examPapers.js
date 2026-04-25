const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const checkJwt = require('../middlewares/auth');
const { listExamPapers, uploadExamPaper } = require('../controllers/examPaperController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({ storage });

// GET /api/exams/papers?exam=JEE_MAIN&year=2022&includeMine=true
router.get('/exams/papers', checkJwt, listExamPapers);

// POST /api/exams/papers
router.post('/exams/papers', checkJwt, upload.single('file'), uploadExamPaper);

module.exports = router;
