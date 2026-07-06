import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageCircle } from 'lucide-react';

const Linkedin = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Instagram = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DEFAULT_COMMITTEE = [
  { _id: 'cc-1', name: 'Abhijith P. S.', role: 'Student Chair', bio: 'Leads the chapter operations, orchestrating events and community growth.', email: 'abhijith@am.amrita.edu', imageUrl: '', socialLinks: { linkedin: '' } },
  { _id: 'cc-2', name: 'Samyuktha R.', role: 'Vice-Chair', bio: 'Oversees programs and builds partnerships for academic and technical success.', email: 'samyuktha@am.amrita.edu', imageUrl: '', socialLinks: { linkedin: '' } },
  { _id: 'cc-3', name: 'Devika M.', role: 'Secretary', bio: 'Handles official chapter records, outreach communications, and coordination.', email: 'devika@am.amrita.edu', imageUrl: '', socialLinks: { linkedin: '' } },
  { _id: 'cc-4', name: 'Harikrishnan S.', role: 'Treasurer', bio: 'Manages chapter budgets, resource allocations, and financial logging.', email: 'harikrishnan@am.amrita.edu', imageUrl: '', socialLinks: { linkedin: '' } },
  { _id: 'cc-5', name: 'Mounesh S.', role: 'Webmaster / Lead Developer', bio: 'Maintains ACM portal development, hosting architectures, and cloud services.', email: 'mounesh@am.amrita.edu', imageUrl: '', socialLinks: { linkedin: '' } }
];

function LeaderCard({ person }) {
  const [isLiked, setIsLiked] = useState(() => {
    const saved = localStorage.getItem(`acm_liked_committee_${person._id}`);
    return saved === 'true';
  });

  const toggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    localStorage.setItem(`acm_liked_committee_${person._id}`, String(next));
  };

  const name = person.name;
  const role = person.role;
  const photo = person.imageUrl || person.photo || '';
  const meta1 = person.meta1 || 'Amrita ACM';
  const meta2 = person.meta2 || 'ACM';
  const buttonText = person.buttonText || 'Connect';
  
  const linkedin = person.socialLinks?.linkedin || person.linkedin || '';
  const email = person.email || '';
  const actionUrl = person.actionUrl || linkedin || (email ? `mailto:${email}` : '#');

  const initials = name.split(' ').filter(n => n.length > 1).map(n => n[0]).join('').substring(0, 2) || name.substring(0, 2);

  return (
    <div className="leader-glass-card">
      <div className="leader-card-img-container">
        {photo ? (
          <img src={photo} alt={name} className="leader-card-img" />
        ) : (
          <div className="leader-card-placeholder">
            <span>{initials}</span>
          </div>
        )}
      </div>

      <div className="leader-card-content">
        <header>
          <h3 className="leader-card-name">{name}</h3>
          <p className="leader-card-role">{role}</p>
        </header>

        <div className="leader-card-meta-row">
          <div className="leader-card-meta-item">
            <svg viewBox="0 0 24 24">
              <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span className="leader-card-meta-text">
              from <span className="leader-card-meta-bold">{meta1}</span>
            </span>
          </div>

          <div className="leader-card-meta-item">
            <svg className="leader-plane-icon" viewBox="0 0 24 24">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
            <span className="leader-card-meta-bold">{meta2}</span>
          </div>
        </div>

        <div className="leader-card-actions">
          <button
            className="leader-card-btn-main"
            onClick={() => {
              if (actionUrl && actionUrl !== '#') {
                window.open(actionUrl, '_blank');
              }
            }}
          >
            {buttonText}
          </button>
          
          <button
            className={`leader-card-btn-like ${isLiked ? 'liked' : ''}`}
            onClick={toggleLike}
            aria-label="Add to favorites"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoreCommitteePage() {
  const [activeTab, setActiveTab] = useState('core-committee');
  const [committee, setCommittee] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('acm_portal_committee');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCommittee(parsed);
      } catch (e) {
        setCommittee(DEFAULT_COMMITTEE);
      }
    } else {
      setCommittee(DEFAULT_COMMITTEE);
    }
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .leader-glass-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 48px;
          padding: 16px;
          width: 100%;
          max-width: 360px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          margin: 0 auto;
        }

        .leader-glass-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .leader-card-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 40px;
          background: var(--bg-tertiary);
        }

        .leader-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .leader-glass-card:hover .leader-card-img {
          transform: scale(1.03);
        }

        .leader-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(var(--accent-rgb), 0.03));
        }

        .leader-card-placeholder span {
          font-size: 48px;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: -0.02em;
        }

        .leader-card-content {
          padding: 24px 12px 8px;
          text-align: left;
        }

        .leader-card-name {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .leader-card-role {
          color: var(--text-secondary);
          font-size: 18px;
          font-weight: 500;
          margin: 4px 0 0;
        }

        .leader-card-meta-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 24px;
        }

        .leader-card-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 15px;
        }

        .leader-card-meta-item svg {
          width: 18px;
          height: 18px;
          stroke: var(--text-secondary);
          fill: none;
          stroke-width: 2;
          opacity: 0.6;
        }

        .leader-card-meta-item svg.leader-plane-icon {
          transform: rotate(45deg);
        }

        .leader-card-meta-text {
          color: var(--text-secondary);
        }

        .leader-card-meta-bold {
          color: var(--text-primary);
          font-weight: 700;
        }

        .leader-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 32px;
          margin-bottom: 8px;
        }

        .leader-card-btn-main {
          flex-grow: 1;
          background: var(--text-primary);
          color: var(--bg-primary);
          font-weight: 600;
          padding: 16px 24px;
          border-radius: 9999px;
          font-size: 15px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);
          transition: transform 0.1s ease, opacity 0.2s ease;
          font-family: inherit;
        }

        .leader-card-btn-main:hover {
          opacity: 0.9;
        }

        .leader-card-btn-main:active {
          transform: scale(0.95);
        }

        .leader-card-btn-like {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: transform 0.1s ease, border-color 0.2s ease, background-color 0.2s ease;
        }

        .leader-card-btn-like:active {
          transform: scale(0.9);
        }

        .leader-card-btn-like svg {
          width: 22px;
          height: 22px;
          stroke: #ef4444;
          fill: none;
          stroke-width: 1.5;
          transition: fill 0.15s ease, stroke 0.15s ease;
        }

        .leader-card-btn-like.liked svg {
          fill: #ef4444;
          stroke: #ef4444;
        }
      `}} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, paddingBottom: '100px' }}>
        <section className="section-container" style={{ paddingTop: '100px' }}>
          <div className="section-header">
            <div className="section-label">Leadership</div>
            <h2 className="section-title-large">Core Committee 2026</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>The driving force behind Amrita ACM Chapter — our elected student leaders.</p>
          </div>
          <div className="apple-grid-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px', marginTop: '48px' }}>
            {committee.map((member) => (
              <LeaderCard key={member._id || member.id} person={member} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
