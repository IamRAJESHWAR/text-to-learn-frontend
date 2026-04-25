const ExamPaper = require('../models/ExamPaper');

async function listExamPapers(req, res) {
  try {
    const { exam, year, includeMine } = req.query;
    const filter = { status: 'approved' };

    if (exam) filter.exam = exam;
    if (year) filter.year = Number(year);

    const papers = await ExamPaper.find(filter).sort({ year: -1 }).lean();

    if (includeMine === 'true') {
      const mine = await ExamPaper.find({ uploadedBy: req.auth?.sub }).sort({ createdAt: -1 }).lean();
      return res.json({ approved: papers, mine });
    }

    res.json({ approved: papers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch papers', details: err.message });
  }
}

async function uploadExamPaper(req, res) {
  try {
    const { exam, year, title } = req.body;
    if (!exam || !year || !title) {
      return res.status(400).json({ error: 'Exam, year, and title are required.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'File is required.' });
    }

    const paper = await ExamPaper.create({
      exam,
      year: Number(year),
      title,
      fileUrl: `/uploads/${req.file.filename}`,
      status: 'approved',
      uploadedBy: req.auth?.sub || 'anonymous',
    });

    res.status(201).json(paper);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload paper', details: err.message });
  }
}

module.exports = { listExamPapers, uploadExamPaper };
