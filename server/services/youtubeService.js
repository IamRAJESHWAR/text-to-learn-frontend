// YouTube API integration for video search
const axios = require('axios');

async function fetchYouTubeVideo(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = 'https://www.googleapis.com/youtube/v3/search';
  const params = {
    part: 'snippet',
    q: query,
    maxResults: 1,
    type: 'video',
    videoEmbeddable: 'true',
    key: apiKey,
  };
  const response = await axios.get(url, { params });
  const items = response.data.items;
  if (items && items.length > 0) {
    return `https://www.youtube.com/embed/${items[0].id.videoId}`;
  }
  return null;
}

module.exports = { fetchYouTubeVideo };
