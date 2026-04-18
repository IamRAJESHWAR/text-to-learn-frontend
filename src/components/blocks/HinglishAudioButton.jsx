import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/api';

const HinglishAudioButton = ({ text }) => {
  const [hinglishText, setHinglishText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (textToSpeak) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const preferred = voices.find(v => v.lang?.toLowerCase().startsWith('hi')) || voices[0];
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.speechSynthesis) {
        throw new Error('Speech synthesis is not supported in this browser.');
      }

      if (hinglishText) {
        speak(hinglishText);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/hinglish-translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const details = payload?.details || payload?.error || 'TTS failed';
        throw new Error(details);
      }
      const payload = await res.json();
      const translated = payload?.hinglish || '';
      if (!translated) throw new Error('Failed to generate Hinglish text.');
      setHinglishText(translated);
      speak(translated);
    } catch (err) {
      setError(err.message || 'Audio generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleClick} disabled={loading}>
          {loading ? 'Generating...' : speaking ? 'Replay Hinglish' : 'Play Hinglish Audio'}
        </button>
        <button onClick={handleStop} disabled={!speaking}>
          Stop
        </button>
      </div>
      {hinglishText && (
        <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>
          Hinglish: {hinglishText}
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default HinglishAudioButton;
