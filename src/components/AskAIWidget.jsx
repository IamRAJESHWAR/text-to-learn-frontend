import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { askAi } from '../utils/api';

const AskAIWidget = () => {
  const { isAuthenticated, getToken, loginWithRedirect } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const token = await getToken();
      const { answer } = await askAi({ question: userText }, token);
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I could not answer that right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
      {!open ? (
        <button onClick={() => setOpen(true)}>Ask AI</button>
      ) : (
        <div style={{ width: 320, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Ask AI</strong>
            <button onClick={() => setOpen(false)} style={{ padding: '4px 10px', background: '#f1f5f9', color: '#475569' }}>Close</button>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto', padding: 12, display: 'grid', gap: 8 }}>
            {messages.length === 0 && (
              <div style={{ color: '#64748b', fontSize: 14 }}>Ask anything about the lesson or exam.</div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  background: msg.role === 'user' ? '#e0e7ff' : '#f8fafc',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div style={{ color: '#64748b' }}>Thinking...</div>}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button onClick={handleSend} disabled={loading}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskAIWidget;
