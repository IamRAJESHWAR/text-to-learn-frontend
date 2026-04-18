import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/api';

const VideoBlock = ({ query }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/youtube?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.url) setVideoUrl(data.url);
        else setError('No video found');
      } catch (err) {
        setError('Error fetching video');
      }
    }
    fetchVideo();
  }, [query]);

  if (error) return <div>{error}</div>;
  if (!videoUrl) return <div>Loading video...</div>;

  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={videoUrl}
        title="Lesson Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoBlock;
