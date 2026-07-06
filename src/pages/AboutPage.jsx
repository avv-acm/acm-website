import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  const [activeTab, setActiveTab] = React.useState('about');

  return (
    <div className="page-transition-enter" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, paddingBottom: '100px' }}>
        <section className="section-container" style={{ paddingTop: '100px' }}>
          <div className="section-header">
            <div className="section-label">Who We Are</div>
            <h2 className="section-title-large">Amrita ACM Student Chapter</h2>
          </div>
          
          <div className="apple-grid" style={{ gridTemplateColumns: '1fr', gap: '30px' }}>
            <div className="apple-card" style={{ minHeight: 'auto' }}>
              <div className="card-top">
                <h3 className="card-title">Our Mission</h3>
                <p className="card-desc" style={{ fontSize: '15px', lineHeight: '1.6', marginTop: '12px' }}>
                  The Amrita ACM Student Chapter serves as a dynamic hub for students at the Amrita Nagercoil campus to cultivate interest and expertise in computing machinery. By organizing high-impact workshops, hackathons, and collaborative projects, we connect students with international computing communities and industry standards.
                </p>
              </div>
            </div>

            <div className="apple-grid-3">
              <div className="liquid-glass-badge" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)' }}>200+</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Active Members</div>
              </div>
              <div className="liquid-glass-badge" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)' }}>15+</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Major Events</div>
              </div>
              <div className="liquid-glass-badge" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)' }}>4</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Special Interest Groups</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
