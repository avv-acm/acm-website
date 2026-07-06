import React from 'react';
import { Link } from 'react-router-dom';
import pencilImage from '../assets/2.png';
import MegChatbot from './MegChatbot';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Campus Sketch Merged at Left Bottom */}
      <img 
        src={pencilImage} 
        alt="Amrita Nagercoil Campus Illustration" 
        className="footer-campus-sketch"
      />

      <div className="footer-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="footer-notes">
          <p>Amrita ACM Student Chapter is registered under ACM International Student Chapters. All computational database services are configured for scalability to support 5000+ concurrent traffic nodes smoothly, backed by modern secure Captcha protection protocols. App UI and values modeled strictly on Apple Human Interface Guidelines.</p>
        </div>
        <div className="footer-links">
          <div className="footer-brand-section">
            <div className="footer-brand-text">
              <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '13px', letterSpacing: '-0.01em' }}>AMRITA ACM</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: '1.4' }}>
                Nagercoil Campus Brand Identity. Empowering student developers to build the future.
              </p>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Chapter Programs</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><Link to="/events" style={{ color: 'var(--text-secondary)' }}>Hackathons</Link></li>
              <li><Link to="/events" style={{ color: 'var(--text-secondary)' }}>Bootcamps</Link></li>
              <li><Link to="/events" style={{ color: 'var(--text-secondary)' }}>Coding Nights</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><Link to="/gallery" style={{ color: 'var(--text-secondary)' }}>Gallery</Link></li>
              <li><Link to="/sigs" style={{ color: 'var(--text-secondary)' }}>SIG Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Campus Hub</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><span style={{ color: 'var(--text-tertiary)' }}>Amrita Nagercoil Campus</span></li>
              <li><span style={{ color: 'var(--text-tertiary)' }}>Tamil Nadu, India</span></li>
              <li><a href="mailto:support@myamrita.me" style={{ color: 'var(--text-secondary)' }}>support@myamrita.me</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-copy">
          <span>Copyright &copy; 2026 Amrita ACM Student Chapter, Nagercoil. All Rights Reserved.</span>
          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
      <MegChatbot />
    </footer>
  );
}
