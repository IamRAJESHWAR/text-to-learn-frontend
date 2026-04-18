import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SidebarNavigation = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (active) => ({
    display: 'block',
    padding: '10px 16px',
    textDecoration: 'none',
    color: active ? 'var(--primary)' : 'var(--text-color)',
    background: active ? '#eff6ff' : 'transparent',
    borderRadius: 8,
    fontWeight: active ? 600 : 500,
    marginBottom: 8,
    transition: 'all 0.2s'
  });

  return (
    <nav style={{ 
      width: 250, 
      background: 'var(--sidebar-bg)', 
      height: '100vh', 
      padding: '24px 20px',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: 40, fontSize: '1.4rem' }}>Text-to-Learn</h2>
      
      <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
        <li><Link to="/" style={linkStyle(isActive('/'))}>Home & Courses</Link></li>
        {isAuthenticated && (
          <li><Link to="/exams/jee-main" style={linkStyle(isActive('/exams/jee-main'))}>Exam Prep</Link></li>
        )}
      </ul>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
        {!isAuthenticated ? (
          <button 
            onClick={() => loginWithRedirect()}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            Log In / Sign Up
          </button>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img 
                src={user?.picture} 
                alt={user?.name} 
                style={{ width: 32, height: 32, borderRadius: '50%' }} 
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
              </div>
            </div>
            <button 
              onClick={() => logout({
                logoutParams: { returnTo: window.location.origin },
                federated: true,
              })}
              style={{ width: '100%', background: '#f1f5f9', color: '#475569', display: 'flex', justifyContent: 'center' }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
