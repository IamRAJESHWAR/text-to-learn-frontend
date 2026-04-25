const { generateAnswer } = require('../services/geminiService');

async function askAi(req, res) {
  const { question, context } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required.' });
  }
  if (question.length > 2000) {
    return res.status(400).json({ error: 'Question is too long.' });
  }

  try {
    const answer = await generateAnswer(question, context || '');
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'AI answer failed', details: err.message });
  }
}

module.exports = { askAi };
