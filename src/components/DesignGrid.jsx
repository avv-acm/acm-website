import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Code2, 
  BookOpen, 
  Smartphone, 
  FolderGit2, 
  Award, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';

export default function DesignGrid({ showNotification }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setIsOpening(true);
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedItem]);

  const resources = [
    {
      id: 'figma-kit',
      title: 'ACM UI/UX Design Kits',
      category: 'Design Templates',
      desc: 'Official design systems, wireframes, and dashboard templates matching Apple HIG for student designers.',
      icon: <Palette size={20} />,
      tag: 'Figma & Sketch',
      linkText: 'Open Community Template',
      details: 'Get access to official Amrita ACM Figma libraries containing UI components, typography scales, buttons, and form templates. Fully responsive, dark mode compatible, and optimized for rapid prototyping.'
    },
    {
      id: 'code-standards',
      title: 'Vite & React Core templates',
      category: 'Code Resources',
      desc: 'Production-grade starting boilerplates, lint configurations, and folder structures for hackathons.',
      icon: <Code2 size={20} />,
      tag: 'React & Vite',
      linkText: 'Clone GitHub Repository',
      details: 'Avoid starting from scratch. Clone our pre-configured React+Vite workspace complete with ESLint rules, automated testing pipelines, custom layout wrappers, and dynamic routing adapters.'
    },
    {
      id: 'workshops',
      title: 'Workshop & Lecture Library',
      category: 'Learning Resources',
      desc: 'Interactive slides, notebook source codes, and recorded live streams from past events.',
      icon: <BookOpen size={20} />,
      tag: 'PDF & Notebooks',
      linkText: 'Browse Archives',
      details: 'Access materials on Machine Learning, Cloud Services, Web Hardening, and Git Workflows. Includes complete step-by-step PDF manuals and Jupyter Notebooks compiled by senior chapter members.'
    },
    {
      id: 'mockup-bezels',
      title: 'Device Presentation Bezels',
      category: 'Marketing Resources',
      desc: 'Beautiful responsive mockups (iPhone, MacBook, iPad) for submitting final project presentations.',
      icon: <Smartphone size={20} />,
      tag: 'Photoshop & SVG',
      linkText: 'Download Bezels Pack',
      details: 'Elevate your hackathon submissions. Download high-resolution PNG and SVG product device frames to showcase your application screens cleanly, just like Apple Developer marketing assets.'
    },
    {
      id: 'projects',
      title: 'Student Project Showcases',
      category: 'Innovation Directory',
      desc: 'Curated directory of projects built by ACM members with live URLs and source codes.',
      icon: <FolderGit2 size={20} />,
      tag: 'Live Demos',
      linkText: 'View Projects Directory',
      details: 'Explore innovative tools, mobile applications, and web services created by ACM Amrita members. Find collaborators, study code architectures, or request code reviews from tech leads.'
    },
    {
      id: 'badge-assets',
      title: 'ACM Identity & Branding',
      category: 'Graphic Assets',
      desc: 'Official high-quality vector badges, chapter logos, and slide templates for presentation decks.',
      icon: <Award size={20} />,
      tag: 'SVG & PNG',
      linkText: 'Download Identity Pack',
      details: 'Official logos, color codes, custom icons, and typography packages to brand your ACM-affiliated events, websites, presentations, and technical documentation.'
    }
  ];

  return (
    <section id="resources" className="section-container">
      <div className="section-header">
        <div className="section-label">ACM Chapter Assets</div>
        <h2 className="section-title-large">Design & Development Resources</h2>
      </div>

      <div className="apple-grid">
        {resources.map((res) => (
          <div 
            key={res.id} 
            className="apple-card"
            onClick={() => setSelectedItem(res)}
          >
            <div className="card-top">
              <div className="card-icon">
                {res.icon}
              </div>
              <h3 className="card-title">{res.title}</h3>
              <p className="card-desc">{res.desc}</p>
            </div>
            
            <div className="card-bottom">
              <span className="card-link">
                {res.linkText} <ChevronRight size={14} />
              </span>
              <span className="card-tag">{res.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal Overlay */}
      {selectedItem && (
        <div className={`modal-overlay ${isOpening ? 'is-opening' : ''}`} onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setSelectedItem(null)}
              aria-label="Close details"
            >
              &times;
            </button>
            
            <div style={styles.modalHeader}>
              <div style={styles.modalIconBg}>
                {selectedItem.icon}
              </div>
              <div>
                <span style={styles.modalSub}>{selectedItem.category}</span>
                <h3 style={styles.modalTitle}>{selectedItem.title}</h3>
              </div>
            </div>

            <div style={styles.modalBody}>
              <p style={styles.modalDesc}>{selectedItem.details}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Enter Roll Number to Request Download:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="NC.SC.U4CSE24229"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '13.5px' }}
                    id="resourceRollNo"
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const input = document.getElementById('resourceRollNo');
                      const rollVal = input ? input.value.trim().toUpperCase() : '';
                      if (!rollVal) {
                        showNotification('error', 'Required', 'Please enter your roll number.');
                        return;
                      }

                      // Check if member exists
                      let memberName = 'Registered Student';
                      try {
                        const raw = localStorage.getItem('acm_portal_members');
                        if (raw) {
                          const list = JSON.parse(raw);
                          const found = list.find(m => (m.rollNo || m.studentId || '').toUpperCase() === rollVal);
                          if (found) {
                            memberName = found.name;
                          }
                        }
                      } catch (err) {}

                      // Save request to localStorage
                      try {
                        const rawReq = localStorage.getItem('acm_resource_requests');
                        const reqs = rawReq ? JSON.parse(rawReq) : [];
                        const newReq = {
                          _id: `req-${Date.now()}`,
                          resourceId: selectedItem.id,
                          resourceTitle: selectedItem.title,
                          rollNo: rollVal,
                          studentName: memberName,
                          requestedAt: new Date().toISOString()
                        };
                        localStorage.setItem('acm_resource_requests', JSON.stringify([newReq, ...reqs]));

                        // Log to system activity audit logs
                        const logsRaw = localStorage.getItem('acm_audit_logs');
                        const logs = logsRaw ? JSON.parse(logsRaw) : [];
                        const newLog = {
                          _id: `log-${Date.now()}`,
                          action: 'RESOURCE_REQUEST',
                          resource: 'resources',
                          details: `Student ${memberName} (${rollVal}) requested resource: ${selectedItem.title}`,
                          severity: 'info',
                          timestamp: new Date().toISOString()
                        };
                        localStorage.setItem('acm_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 200)));
                      } catch (err) {}

                      showNotification('success', 'Download Started', `Resource request received. Downloading "${selectedItem.title}" package.`);
                      setSelectedItem(null);
                    }}
                    style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={14} /> Request
                  </button>
                </div>
              </div>

              <div className="liquid-glass-badge" style={{ ...styles.specBadge, marginTop: '20px' }}>
                <Sparkles size={14} color="var(--accent)" />
                <span>Verified chapter download. Triggers administrator approval.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '20px'
  },
  modalIconBg: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)',
    border: '1px solid var(--border)'
  },
  modalSub: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    marginTop: '2px',
    color: 'var(--text-primary)'
  },
  modalBody: {
    marginBottom: '32px'
  },
  modalDesc: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '20px'
  },
  specBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    color: 'var(--text-primary)'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px'
  }
};
