import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LocalNavbar({ title, links = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent content from hiding behind fixed navbars */}
      <div style={{ height: '52px' }} />
      <div 
        style={{
          position: 'fixed',
          top: '56px', // Assuming main navbar is 56px high
          left: 0,
          right: 0,
          height: '52px',
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : '#111111',
          backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 22px',
          zIndex: 90,
          transition: 'all 0.3s ease',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ 
            fontSize: '21px', 
            fontWeight: 600, 
            color: '#f5f5f7', 
            margin: 0, 
            letterSpacing: '-0.01em' 
          }}>
            {title}
          </h2>
          
          {links && links.length > 0 && (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {links.map((link, idx) => (
                <Link 
                  key={idx} 
                  to={link.to || '#'} 
                  onClick={link.onClick}
                  style={{ 
                    color: link.active ? '#f5f5f7' : '#a1a1a6',
                    fontSize: '12px',
                    fontWeight: link.active ? 600 : 400,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    letterSpacing: '-0.01em'
                  }}
                  onMouseOver={(e) => { if(!link.active) e.target.style.color = '#f5f5f7'; }}
                  onMouseOut={(e) => { if(!link.active) e.target.style.color = '#a1a1a6'; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
