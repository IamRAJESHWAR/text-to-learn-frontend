const mongoose = require('mongoose');

const examPaperSchema = new mongoose.Schema(
  {
    exam: {
      type: String,
      required: true,
      enum: ['JEE_MAIN', 'NEET', 'EAMCET_MPC', 'EAMCET_BIPC'],
      index: true,
    },
    year: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending', index: true },
    uploadedBy: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExamPaper', examPaperSchema);
