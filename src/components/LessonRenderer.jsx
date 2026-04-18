import React from 'react';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CodeBlock from './blocks/CodeBlock';
import VideoBlock from './blocks/VideoBlock';
import MCQBlock from './blocks/MCQBlock';

const LessonRenderer = ({ content, mode = 'screen', onMcqSelect, mcqSelections, showQuizResult }) => {
  const isPdf = mode === 'pdf';
  return (
    <div>
      {content.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return isPdf ? (
              <div key={idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid', marginBottom: 12 }}>
                <h2 style={{ margin: '0 0 8px', lineHeight: 1.3 }}>{block.text}</h2>
              </div>
            ) : (
              <HeadingBlock key={idx} text={block.text} />
            );
          case 'paragraph':
            return isPdf ? (
              <div key={idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid', marginBottom: 12 }}>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{block.text}</p>
              </div>
            ) : (
              <ParagraphBlock key={idx} text={block.text} />
            );
          case 'code':
            return isPdf ? (
              <div key={idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid', marginBottom: 12 }}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.4 }}>
                  <code>{block.text}</code>
                </pre>
              </div>
            ) : (
              <CodeBlock key={idx} language={block.language} text={block.text} />
            );
          case 'video':
            return isPdf ? (
              <div key={idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid', marginBottom: 12 }}>
                <p style={{ margin: 0, lineHeight: 1.5 }}>Video: {block.query}</p>
              </div>
            ) : (
              <VideoBlock key={idx} query={block.query} />
            );
          case 'mcq':
            return isPdf ? (
              <div key={idx} style={{ breakInside: 'avoid', pageBreakInside: 'avoid', margin: '1em 0' }}>
                <strong>{block.question}</strong>
                <ul style={{ marginTop: 6, lineHeight: 1.5 }}>
                  {block.options?.map((opt, optIdx) => (
                    <li key={optIdx} style={{ marginBottom: 4 }}>{opt}</li>
                  ))}
                </ul>
                {block.answer !== undefined && block.answer !== null && (
                  <div>
                    Answer: {typeof block.answer === 'number' ? block.options?.[block.answer] : block.answer}
                  </div>
                )}
                {block.explanation && <div>Explanation: {block.explanation}</div>}
              </div>
            ) : (
              <MCQBlock
                key={idx}
                question={block.question}
                options={block.options}
                answer={block.answer}
                explanation={block.explanation}
                selectedIndex={mcqSelections?.[idx] ?? null}
                onSelect={selection => onMcqSelect?.(idx, selection)}
                showResult={showQuizResult}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default LessonRenderer;
