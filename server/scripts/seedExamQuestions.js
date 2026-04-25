const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const ExamQuestion = require('../models/ExamQuestion');

dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const data = require('../data/examQuestions.json');
    const existing = await ExamQuestion.countDocuments();
    if (existing > 0) {
      console.log('Exam questions already exist. Skipping seed.');
      process.exit(0);
    }
    await ExamQuestion.insertMany(data);
    console.log('Seeded exam questions.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
