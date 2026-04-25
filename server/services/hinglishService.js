// Gemini API integration for translation and TTS
const axios = require('axios');

async function translateToHinglish(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
  const prompt = `Translate the following English text to Hinglish (Hindi written in English script):\n${text}`;
  try {
    const response = await axios.post(
      url,
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: apiKey } }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    const details = data ? JSON.stringify(data) : error.message;
    throw new Error(`Hinglish translate error${status ? ` (${status})` : ''}: ${details}`);
  }
}

async function hinglishTTS(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  try {
    const response = await axios.post(
      url,
      {
        input: { text },
        voice: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-A' },
        audioConfig: { audioEncoding: 'LINEAR16' },
      },
      { params: { key: apiKey } }
    );
    return Buffer.from(response.data.audioContent, 'base64');
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    const details = data ? JSON.stringify(data) : error.message;
    throw new Error(`Hinglish TTS error${status ? ` (${status})` : ''}: ${details}`);
  }
}

module.exports = { translateToHinglish, hinglishTTS };
