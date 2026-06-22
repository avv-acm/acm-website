import React from 'react';
import { ArrowRight, ChevronRight, Terminal } from 'lucide-react';

export default function Hero({ onJoinClick, onExploreClick }) {
  return (
    <section className="hero">
      <div 
        className="liquid-glass-badge" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        <Terminal size={12} color="var(--accent)" />
        Amrita Nagercoil Campus Chapter
      </div>
      
      <h1 className="hero-title">
        Where Computing<br />Meets Innovation.
      </h1>
      
      <p className="hero-subtitle">
        Join a premium community of developers, designers, and researchers pushing the boundaries of technology.
      </p>
      
      <div className="hero-ctas">
        <button className="btn btn-primary" onClick={onJoinClick}>
          Join Chapter <ArrowRight size={16} />
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={onExploreClick}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          Explore Resources <ChevronRight size={16} color="var(--text-secondary)" />
        </button>
      </div>
    </section>
  );
}
