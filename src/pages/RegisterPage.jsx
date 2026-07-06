import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  Sparkles, 
  Download, 
  Wand2, 
  BookOpen, 
  ArrowRight, 
  Menu,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

/* Custom SVG Icons because they are not exported by the installed lucide-react version */
const Twitter = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const INTEREST_OPTIONS = [
  'AI & Machine Learning',
  'Cybersecurity',
  'Web Development',
  'Competitive Programming',
  'Social Media & Marketing',
  'Open Source',
  'Cloud Computing',
  'Data Science'
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    interests: [],
    agreedToTerms: false
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();

  const submitRegistration = useMutation(api.registrations.add);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.name.trim()) return 'Please enter your full name.';
      if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid university email.';
    }
    if (step === 2) {
      if (!formData.department) return 'Please select your department.';
      if (!formData.year) return 'Please select your year.';
    }
    if (step === 3) {
      if (formData.interests.length === 0) return 'Please select at least one interest.';
      if (!formData.agreedToTerms) return 'You must agree to the Terms of Service & Privacy Policy.';
    }
    return null;
  };

  const handleNextStep = () => {
    setErrorMsg('');
    const error = validateStep(activeStep);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const error = validateStep(3);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setStatus('submitting');
    try {
      await submitRegistration({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        department: formData.department,
        year: formData.year,
        interests: formData.interests,
        agreedToTerms: formData.agreedToTerms
      });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Registration failed. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#000000',
        fontFamily: "'Poppins', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'hidden'
      }}>
        {/* Load Poppins */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@1,8..60,400;1,8..60,600&display=swap" rel="stylesheet" />

        {/* Video Background */}
        <video
          autoPlay loop muted playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />

        {/* Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          .glass-card {
            background: rgba(255, 255, 255, 0.02);
            background-blend-mode: luminosity;
            backdrop-filter: blur(50px);
            -webkit-backdrop-filter: blur(50px);
            border: none;
            box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            max-width: 480px;
            width: 100%;
            padding: 40px;
            z-index: 10;
            text-align: center;
          }
          .glass-card::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1.4px;
            background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 20%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
          }
        `}} />

        <div className="glass-card">
          <CheckCircle size={64} color="#ffffff" strokeWidth={1.5} style={{ marginBottom: '24px', opacity: 0.9 }} />
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#ffffff', marginBottom: '12px', tracking: '-0.03em' }}>
            Registration Successful!
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '8px' }}>
            Welcome to Amrita ACM. Your application is now in review. We will contact you shortly.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '32px', fontStyle: 'italic' }}>
            📧 A confirmation email has been dispatched. Please check your spam folder if it doesn't appear.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              padding: '14px',
              borderRadius: '9999px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#000000',
      fontFamily: "'Poppins', sans-serif",
      color: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Dynamic Font & Style Injection */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@1,8..60,400;1,8..60,600&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{__html: `
        .liquid-glass {
          background: rgba(255,255,255,0.01);
          background-blend-mode: luminosity;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: none;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.4px;
          background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, transparent 40%, transparent 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .liquid-glass-strong {
          background: rgba(255,255,255,0.02);
          background-blend-mode: luminosity;
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          border: none;
          box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass-strong::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.4px;
          background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 20%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .input-glass {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          outline: none;
          padding: 16px 20px;
          border-radius: 14px;
          color: #ffffff;
          font-family: inherit;
          font-size: 15px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
          transition: background 0.3s;
        }
        .input-glass:focus {
          background: rgba(255, 255, 255, 0.1);
        }

        .select-glass {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          outline: none;
          padding: 16px 20px;
          border-radius: 14px;
          color: #ffffff;
          font-family: inherit;
          font-size: 15px;
          width: 100%;
          box-sizing: border-box;
          appearance: none;
          cursor: pointer;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 20px center;
        }

        .hover-grow {
          transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .hover-grow:hover {
          transform: scale(1.05);
        }
        .hover-grow:active {
          transform: scale(0.95);
        }

        @media (min-width: 1024px) {
          .lg-flex {
            display: flex !important;
          }
        }
      `}} />

      {/* Video Background */}
      <video
        autoPlay loop muted playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />

      {/* Main Overlay Container */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: '100vh' }}>
        
        {/* LEFT PANEL */}
        <div style={{ width: '100%', flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div className="liquid-glass-strong" style={{
            position: 'absolute',
            inset: '16px',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10
          }}>
            {/* Nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#ffffff' }}>
                <img src="/acm-logo.png" alt="ACM logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                <span style={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-0.04em' }}>acm amrita</span>
              </Link>
              <button 
                onClick={() => navigate('/')}
                className="liquid-glass hover-grow"
                style={{
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Back to site
              </button>
            </div>

            {/* Middle Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '480px', margin: '0 auto', width: '100%', padding: '24px 0' }}>
              
              {!showForm ? (
                /* HERO VIEW */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <img src="/acm-logo.png" alt="ACM" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '24px', opacity: 0.95 }} />
                  <h1 style={{
                    fontSize: 'clamp(36px, 5vw, 64px)',
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: '-0.05em',
                    marginBottom: '32px',
                  }}>
                    Innovating the <br />
                    spirit of <em style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontWeight: 400, opacity: 0.8 }}>ACM Amrita</em>
                  </h1>

                  <button
                    onClick={() => setShowForm(true)}
                    className="liquid-glass-strong hover-grow"
                    style={{
                      border: 'none',
                      color: '#ffffff',
                      padding: '16px 36px',
                      borderRadius: '9999px',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '40px'
                    }}
                  >
                    Explore Now
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Download size={14} />
                    </div>
                  </button>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Artistic Gallery', 'AI Generation', '3D Structures'].map((pill) => (
                      <span key={pill} className="liquid-glass" style={{ padding: '6px 14px', borderRadius: '9999px', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* REGISTRATION FORM VIEW */
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 500, letterSpacing: '-0.03em', marginBottom: '4px' }}>Join the Chapter</h2>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Step {activeStep} of 3</p>
                  </div>

                  {/* Step 1: Basic Info */}
                  {activeStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="text" placeholder="Full Name *" required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="input-glass"
                      />
                      <input
                        type="email" placeholder="University Email Address *" required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="input-glass"
                      />
                      <input
                        type="tel" placeholder="Phone Number (Optional)"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="input-glass"
                      />
                    </div>
                  )}

                  {/* Step 2: Department & Year */}
                  {activeStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <select
                        value={formData.department} required
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="select-glass"
                        style={{ color: formData.department ? '#ffffff' : 'rgba(255,255,255,0.4)' }}
                      >
                        <option value="" disabled style={{ backgroundColor: '#111' }}>Select Department *</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d} style={{ backgroundColor: '#111' }}>{d}</option>)}
                      </select>

                      <select
                        value={formData.year} required
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="select-glass"
                        style={{ color: formData.year ? '#ffffff' : 'rgba(255,255,255,0.4)' }}
                      >
                        <option value="" disabled style={{ backgroundColor: '#111' }}>Select Year *</option>
                        {YEARS.map(y => <option key={y} value={y} style={{ backgroundColor: '#111' }}>{y}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Step 3: Interests & Submit */}
                  {activeStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Areas of Interest *</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {INTEREST_OPTIONS.map(interest => {
                            const selected = formData.interests.includes(interest);
                            return (
                              <button
                                key={interest} type="button"
                                onClick={() => toggleInterest(interest)}
                                className="liquid-glass hover-grow"
                                style={{
                                  padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                                  color: selected ? '#ffffff' : 'rgba(255,255,255,0.6)',
                                  backgroundColor: selected ? 'rgba(255,255,255,0.15)' : 'transparent',
                                  cursor: 'pointer', border: 'none', transition: 'all 0.15s ease'
                                }}
                              >
                                {selected ? '✓ ' : ''}{interest}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox" checked={formData.agreedToTerms}
                          onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                          style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#ffffff', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                          I have read and agree to the Terms of Service and Privacy Policy.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Error display */}
                  {errorMsg && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 59, 48, 0.15)', border: '1px solid rgba(255, 59, 48, 0.25)' }}>
                      <AlertCircle size={14} color="#ff453a" />
                      <p style={{ color: '#ff453a', fontSize: '12px', margin: 0 }}>{errorMsg}</p>
                    </div>
                  )}

                  {/* Wizard Actions */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    {activeStep > 1 && (
                      <button
                        type="button" onClick={handlePrevStep}
                        className="liquid-glass hover-grow"
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', color: '#ffffff', fontSize: '14px', cursor: 'pointer' }}
                      >
                        Back
                      </button>
                    )}
                    {activeStep < 3 ? (
                      <button
                        type="button" onClick={handleNextStep}
                        className="liquid-glass-strong hover-grow"
                        style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit" disabled={status === 'submitting'}
                        className="liquid-glass-strong hover-grow"
                        style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: status === 'submitting' ? 'wait' : 'pointer' }}
                      >
                        {status === 'submitting' ? 'Processing...' : 'Register'}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setActiveStep(1); setErrorMsg(''); }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', marginTop: '8px', alignSelf: 'center' }}
                  >
                    Cancel Registration
                  </button>
                </form>
              )}

            </div>

            {/* Bottom Quote */}
            <div style={{ textAlign: 'center', marginTop: 'auto' }}>
              <p style={{ fontSize: '10px', trackingWidth: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                VISIONARY DESIGN
              </p>
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
                "We imagined a realm with <em style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic' }}>no ending</em>."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>MARCUS AURELIO</span>
                <div style={{ width: '16px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL (Desktop Only) */}
        <div className="lg:flex" style={{
          width: '48%',
          position: 'relative',
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px',
          zIndex: 10
        }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
            <div className="liquid-glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 14px', borderRadius: '9999px' }}>
              <a href="#" className="hover-grow" style={{ color: '#ffffff', display: 'flex' }}><Twitter size={15} /></a>
              <a href="#" className="hover-grow" style={{ color: '#ffffff', display: 'flex' }}><Linkedin size={15} /></a>
              <a href="#" className="hover-grow" style={{ color: '#ffffff', display: 'flex' }}><Instagram size={15} /></a>
              <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <ArrowRight size={14} style={{ opacity: 0.6 }} />
            </div>
            <button className="liquid-glass hover-grow" style={{ border: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: '9999px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Ecosystem
            </button>
          </div>

          {/* Community Card */}
          <div className="liquid-glass hover-grow" style={{ width: '224px', padding: '20px', borderRadius: '20px', marginTop: '40px', alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Enter our ecosystem</h3>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
              Join a community of 500+ builders, creators, and innovators. Access mentorship, labs, and collaborative projects.
            </p>
          </div>

          {/* Bottom Feature Section */}
          <div className="liquid-glass" style={{ marginTop: 'auto', borderRadius: '24px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="liquid-glass hover-grow" style={{ padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Wand2 size={16} />
                <h4 style={{ fontSize: '12px', fontWeight: 500 }}>Active Projects</h4>
              </div>
              <div className="liquid-glass hover-grow" style={{ padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <BookOpen size={16} />
                <h4 style={{ fontSize: '12px', fontWeight: 500 }}>Resource Library</h4>
              </div>
            </div>

            <div className="liquid-glass hover-grow" style={{ padding: '12px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/images/event_2.png"
                  alt="ACM thumbnail"
                  style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 500 }}>Advanced Tech Dev</h4>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Interactive workspaces</p>
                </div>
              </div>
              <button style={{ border: 'none', background: 'rgba(255,255,255,0.1)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
