import React, { useState, useEffect } from 'react';
import Captcha from './Captcha';
import { UserPlus, Sparkles, User, Mail, Hash, Code } from 'lucide-react';

export default function JoinModal({ onClose, onSubmitSuccess, showNotification }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    interest: 'web'
  });
  
  const [errors, setErrors] = useState({});
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Invalid email format.';
    } else if (!formData.email.endsWith('am.amrita.edu') && !formData.email.endsWith('gmail.com')) {
      // Amrita institutional email check
      tempErrors.email = 'Please use Amrita email (@am.amrita.edu) or Gmail.';
    }

    if (!formData.rollNo.trim()) {
      tempErrors.rollNo = 'Roll number is required.';
    } else if (!/^[A-Z0-9.-]+$/i.test(formData.rollNo)) {
      tempErrors.rollNo = 'Invalid roll number format.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleVerify = (token) => {
    setIsCaptchaVerified(true);
    setCaptchaToken(token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isCaptchaVerified) {
      if (showNotification) {
        showNotification('error', 'Security Verification', 'Please complete the security captcha challenge.');
      } else {
        alert('Please complete the security captcha.');
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate database insertion with a 1.2s timeout
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess({
        ...formData,
        id: 'ACM-' + Math.floor(100000 + Math.random() * 900000),
        joinedAt: new Date().toISOString()
      });
    }, 1200);
  };

  return (
    <div className={`modal-overlay ${isOpening ? 'is-opening' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close form">
          &times;
        </button>

        <div style={styles.header}>
          <div style={styles.logoBg}>
            <UserPlus size={24} color="#ffffff" />
          </div>
          <h2 style={styles.title}>Join Amrita ACM</h2>
          <p style={styles.subtitle}>Register for the ACM Student Chapter</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                style={styles.input}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Amrita Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="text"
                className="form-input"
                style={styles.input}
                placeholder="name@am.amrita.edu"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rollNo">Student Roll Number / Registration ID</label>
            <div style={styles.inputWrapper}>
              <Hash size={16} style={styles.inputIcon} />
              <input
                id="rollNo"
                name="rollNo"
                type="text"
                className="form-input"
                style={styles.input}
                placeholder="AM.EN.U4CSE23001"
                value={formData.rollNo}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.rollNo && <span style={styles.errorText}>{errors.rollNo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="interest">Primary Interest / Domain</label>
            <div style={styles.inputWrapper}>
              <Code size={16} style={styles.inputIcon} />
              <select
                id="interest"
                name="interest"
                className="form-input"
                style={styles.select}
                value={formData.interest}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="web">Fullstack & Frontend Web Development</option>
                <option value="ai-ml">Artificial Intelligence & Machine Learning</option>
                <option value="cp">Competitive Programming & Data Structures</option>
                <option value="cyber">Cyber Security & Networks</option>
                <option value="ui-ux">UI/UX Design & Branding</option>
              </select>
            </div>
          </div>

          <Captcha onVerify={handleVerify} />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isCaptchaVerified || isSubmitting}
            style={{
              ...styles.submitBtn,
              opacity: !isCaptchaVerified || isSubmitting ? 0.5 : 1,
              cursor: !isCaptchaVerified || isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? (
              <span style={styles.spinner}></span>
            ) : (
              <>
                <Sparkles size={16} /> Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px'
  },
  logoBg: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0, 113, 227, 0.4)',
    marginBottom: '16px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.015em',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-tertiary)',
    pointerEvents: 'none'
  },
  input: {
    paddingLeft: '44px',
    width: '100%'
  },
  select: {
    paddingLeft: '44px',
    width: '100%',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2386868b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px'
  },
  errorText: {
    fontSize: '12px',
    color: '#ff453a',
    marginTop: '4px',
    textAlign: 'left'
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    marginTop: '10px'
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite'
  }
};

// Inject CSS styles for Spinner Animation if not already there
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}
