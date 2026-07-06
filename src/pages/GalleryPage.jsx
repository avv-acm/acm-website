import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('acm_admin_gallery');
    return saved ? JSON.parse(saved) : [
      {
        _id: 'mem-1',
        title: 'Vite React Workshop Launch',
        summary: 'Highlights from our hands-on Vite and React workshop for sophomores.',
        photos: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'],
        tags: ['React', 'Workshop', 'Vite'],
        published: true
      },
      {
        _id: 'mem-2',
        title: 'Zero-Trust Hackathon Kickoff',
        summary: 'Opening ceremony of the Zero-Trust Hackathon focusing on web hardening.',
        photos: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'],
        tags: ['Hackathon', 'Security'],
        published: true
      }
    ];
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, paddingBottom: '100px' }}>
        <section className="section-container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
          <div className="section-header">
            <div className="section-label">Milestones & Visuals</div>
            <h2 className="section-title-large">ACM Memory Archives</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '6px', maxWidth: '600px' }}>
              Relive the coding nights, hackathons, and technology workshops organized by the Amrita ACM Chapter.
            </p>
          </div>

          {/* Gallery Grid */}
          {gallery.filter(item => item.published).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '16px' }}>No public gallery memories uploaded yet.</p>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Memories added by administrators in the portal will appear here.</p>
            </div>
          ) : (
            <div className="apple-grid" style={{ marginTop: '30px' }}>
              {gallery
                .filter(item => item.published)
                .map((item) => {
                  const firstPhoto = item.photos && item.photos[0] ? item.photos[0] : '';
                  return (
                    <div 
                      className="apple-card" 
                      key={item._id} 
                      style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => setSelectedGalleryItem(item)}
                    >
                      <div style={{ height: '200px', overflow: 'hidden', background: 'var(--bg-elevated)', position: 'relative' }}>
                        {firstPhoto ? (
                          <img 
                            src={firstPhoto} 
                            alt={item.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                            className="gallery-hover-zoom"
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                            No Cover Photo
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', color: '#fff', backdropFilter: 'blur(4px)' }}>
                          {item.photos?.length || 0} Photo{item.photos?.length === 1 ? '' : 's'}
                        </div>
                      </div>
                      <div style={{ padding: '20px 24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px' }}>{item.summary}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {(item.tags || []).map((tag, tIdx) => (
                            <span key={tIdx} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Gallery Detail Modal */}
          {selectedGalleryItem && (
            <div className="modal-overlay" onClick={() => setSelectedGalleryItem(null)}>
              <div className="modal-content" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedGalleryItem(null)}>
                  &times;
                </button>

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Memory</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{selectedGalleryItem.title}</h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>{selectedGalleryItem.summary}</p>
                </div>

                {/* Grid of all photos */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', margin: '20px 0' }}>
                  {(selectedGalleryItem.photos || []).map((photo, pIdx) => (
                    <div key={pIdx} style={{ borderRadius: '12px', overflow: 'hidden', height: '140px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
                      <img 
                        src={photo} 
                        alt={`Asset ${pIdx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} 
                        onClick={() => window.open(photo, '_blank')}
                      />
                    </div>
                  ))}
                </div>

                {selectedGalleryItem.videoUrl && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Event Video / Vlog</h4>
                    <a 
                      href={selectedGalleryItem.videoUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-secondary" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                    >
                      Watch Recorded Stream / Presentation Video &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
