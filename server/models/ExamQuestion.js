const mongoose = require('mongoose');

const examQuestionSchema = new mongoose.Schema(
  {
    exam: {
      type: String,
      required: true,
      enum: ['JEE_MAIN', 'NEET', 'EAMCET_MPC', 'EAMCET_BIPC'],
      index: true,
    },
    stream: {
      type: String,
      enum: ['MPC', 'BIPC'],
    },
    subject: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
    solution: { type: String, required: true },
    source: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExamQuestion', examQuestionSchema);
