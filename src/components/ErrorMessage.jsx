/* Error message component */
import React from 'react';

const ErrorMessage = ({ message = 'Something went wrong. Please try again.' }) => (
  <div style={{
    background: '#fff5f5', border: '1px solid #fed7d7',
    borderRadius: 8, padding: '16px 20px', color: '#c53030',
    display: 'flex', alignItems: 'center', gap: 10,
    margin: '16px 0',
  }}>
    <span style={{ fontSize: 20 }}>⚠️</span>
    <span>{message}</span>
  </div>
);

export default ErrorMessage;
