const express = require('express');
const router = express.Router();
const { fetchYouTubeVideo } = require('../services/youtubeService');

// GET /api/youtube?query=...
router.get('/youtube', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });
  try {
    const url = await fetchYouTubeVideo(query);
    if (url) {
      res.json({ url });
    } else {
      res.status(404).json({ error: 'No video found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'YouTube API error', details: err.message });
  }
});

module.exports = router;
