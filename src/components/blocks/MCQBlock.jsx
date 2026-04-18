import React, { useState } from 'react';

const MCQBlock = ({
  question,
  options,
  answer,
  explanation,
  selectedIndex,
  onSelect,
  showResult,
}) => {
  const [showSolution, setShowSolution] = useState(false);

  const answerIndex = typeof answer === 'number' ? answer : options.indexOf(answer);
  const isCorrect = showResult && selectedIndex === answerIndex;

  return (
    <div style={{ margin: '1em 0' }}>
      <strong>{question}</strong>
      <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 10 }}>
        {options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const isAnswer = showSolution && idx === answerIndex;
          return (
            <li key={idx} style={{ marginBottom: 6 }}>
              <label style={{ cursor: showResult ? 'default' : 'pointer' }}>
                <input
                  type="radio"
                  name={question}
                  value={idx}
                  disabled={showResult}
                  checked={isSelected}
                  onChange={() => onSelect?.(idx)}
                  style={{ marginRight: 8 }}
                />
                <span style={{ color: isAnswer ? 'green' : 'inherit' }}>{opt}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => setShowSolution(true)}
          disabled={!showResult || showSolution}
        >
          {showSolution ? 'Solution Shown' : 'Show Solution'}
        </button>
        {showResult && (
          <span style={{ color: isCorrect ? 'green' : 'red' }}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </span>
        )}
      </div>

      {showResult && (
        <div style={{ marginTop: 8 }}>
          Result: {isCorrect ? 'Correct' : 'Incorrect'}
        </div>
      )}
      {showSolution && answerIndex >= 0 && (
        <div style={{ marginTop: 6 }}>
          <div style={{ color: 'green' }}>Solution: {options[answerIndex]}</div>
          {explanation && (
            <div style={{ marginTop: 4, color: '#475569' }}>{explanation}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MCQBlock;
