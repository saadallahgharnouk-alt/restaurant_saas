import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/restaurants', label: 'Restaurants', icon: '🏪' },
    { path: '/menu', label: 'Menu', icon: '📜' },
    { path: '/kitchen', label: 'Kitchen', icon: '🍳' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/order', label: 'Customer Order', icon: '📱' },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">⬡</div>
          <div className="brand-text">
            <span className="brand-name">ManusResto</span>
            <span className="brand-sub">SaaS Platform</span>
          </div>
        </Link>
        
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
              {location.pathname === link.path && <div className="nav-dot" />}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <div className="status-pill">
            <div className="status-dot" />
            LIVE SYSTEM
          </div>
        </div>
      </nav>
      
      <main className="page-content">
        {children}
      </main>
    </div>
  );
}
