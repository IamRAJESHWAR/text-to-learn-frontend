/* Loading spinner component */
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px', gap: '16px',
  }}>
    <div style={{
      width: 48, height: 48,
      border: '5px solid #e2e8f0',
      borderTop: '5px solid #6c63ff',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{message}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;
