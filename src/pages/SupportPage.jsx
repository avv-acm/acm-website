import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Search, ChevronRight, MessageCircle, FileText, Monitor, Users } from 'lucide-react';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('support');
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const submitInquiry = useMutation(api.contact_inquiries.add);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await submitInquiry(formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  const supportTopics = [
    { name: 'Membership', icon: <Users size={48} strokeWidth={1} /> },
    { name: 'Technical', icon: <Monitor size={48} strokeWidth={1} /> },
    { name: 'Events', icon: <FileText size={48} strokeWidth={1} /> },
    { name: 'Portal', icon: <MessageCircle size={48} strokeWidth={1} /> }
  ];

  return (
    <div className="page-transition-enter" style={{ backgroundColor: '#ffffff', color: '#1d1d1f', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1, paddingBottom: '100px' }}>
        
        {/* Massive Hero Section with Search */}
        <section style={{ 
          position: 'relative',
          padding: '120px 22px 80px', 
          textAlign: 'center',
          overflow: 'hidden',
          backgroundColor: '#f5f5f7'
        }}>
          {/* Subtle background gradient to mimic hero image vibe */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, #ffffff 0%, #f5f5f7 100%)', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '40px' }}>
              Welcome to ACM Support
            </h1>
            
            {/* Apple-style giant search bar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#ffffff', 
              borderRadius: '12px', 
              padding: '8px 24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              margin: '0 auto',
              maxWidth: '680px'
            }}>
              <Search size={24} color="#86868b" />
              <input 
                type="text" 
                placeholder="Search for topics, resources, and more" 
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  outline: 'none', 
                  padding: '16px', 
                  fontSize: '21px', 
                  backgroundColor: 'transparent',
                  color: '#1d1d1f'
                }} 
              />
            </div>
          </div>
        </section>

        {/* Product/Topic Icons Grid */}
        <section style={{ padding: '60px 22px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '32px',
            justifyItems: 'center'
          }}>
            {supportTopics.map((topic, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                color: '#1d1d1f'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#0071e3'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#1d1d1f'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
                  {topic.icon}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 400 }}>{topic.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid #d2d2d7', margin: '40px auto', maxWidth: '1000px' }} />

        {/* Integrated Contact Form Area */}
        <section style={{ padding: '60px 22px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.01em' }}>
              Contact Us Directly
            </h2>
            <p style={{ fontSize: '19px', color: '#86868b', maxWidth: '600px', margin: '0 auto' }}>
              Can’t find what you’re looking for? Send a direct message to our support team and we will get back to you securely.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '24px', 
            padding: '40px',
            border: '1px solid #d2d2d7',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ padding: '16px', borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '17px', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#0071e3'}
                  onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ padding: '16px', borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '17px', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#0071e3'}
                  onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
                />
              </div>
              <input 
                type="text" 
                placeholder="Subject" 
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                style={{ padding: '16px', borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '17px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#0071e3'}
                onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
              />
              <textarea 
                placeholder="Please describe your issue..." 
                required
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                style={{ padding: '16px', borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '17px', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                onFocus={(e) => e.target.style.borderColor = '#0071e3'}
                onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
              />
              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                style={{ 
                  padding: '16px 32px', 
                  borderRadius: '12px', 
                  border: 'none',
                  backgroundColor: formStatus === 'success' ? '#34c759' : '#0071e3', 
                  color: '#fff', 
                  fontSize: '17px', 
                  fontWeight: 600,
                  cursor: formStatus === 'submitting' ? 'wait' : 'pointer',
                  alignSelf: 'center',
                  marginTop: '10px',
                  minWidth: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {formStatus === 'submitting' ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : (
                  <>Submit Request <ChevronRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
