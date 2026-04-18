import React from 'react';

const CodeBlock = ({ language, text }) => (
  <pre>
    <code className={`language-${language}`}>{text}</code>
  </pre>
);

export default CodeBlock;
