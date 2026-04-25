const express = require('express');
const router = express.Router();
const { translateToHinglish, hinglishTTS } = require('../services/hinglishService');

// POST /api/hinglish-translate
router.post('/hinglish-translate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });
  try {
    const hinglish = await translateToHinglish(text);
    res.json({ hinglish });
  } catch (err) {
    res.status(500).json({ error: 'Translate error', details: err.message });
  }
});

// POST /api/hinglish-tts
router.post('/hinglish-tts', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });
  try {
    const hinglish = await translateToHinglish(text);
    const audioBuffer = await hinglishTTS(hinglish);
    res.set('Content-Type', 'audio/wav');
    res.send(audioBuffer);
  } catch (err) {
    res.status(500).json({ error: 'TTS error', details: err.message });
  }
});

module.exports = router;
