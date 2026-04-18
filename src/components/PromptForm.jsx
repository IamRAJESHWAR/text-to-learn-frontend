import React, { useState } from 'react';

const PromptForm = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>What do you want to learn today?</h2>
      <p style={{ color: '#64748b', marginBottom: 20 }}>
        Enter a topic and our AI will generate a complete course for you.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="e.g. Introduction to React Hooks"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={!topic.trim() || isLoading}>
          Generate Course
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
