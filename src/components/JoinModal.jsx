import React, { useState, useEffect } from 'react';
import Captcha from './Captcha';
import { UserPlus, Sparkles, User, Mail, Hash, Code, Users } from 'lucide-react';

export default function JoinModal({ onClose, onSubmitSuccess, showNotification, defaultInterest }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    year: '1st Year',
    department: 'Computer Science and Engineering',
    interest: defaultInterest || 'web'
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
    if (!formData.name.trim()) tempErrors.name = 'Full name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Invalid email format.';
    } else if (!formData.email.toLowerCase().endsWith('nc.students.amrita.edu') && !formData.email.endsWith('gmail.com')) {
      // Amrita institutional email check
      tempErrors.email = 'Please use Amrita email (@nc.students.amrita.edu) or Gmail.';
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
    let updatedData = { ...formData, [name]: value };

    if (name === 'email') {
      const emailVal = value.trim().toUpperCase();
      const rollMatch = emailVal.match(/^([A-Z0-9.-]+)@NC\.STUDENTS\.AMRITA\.EDU$/i);
      if (rollMatch) {
        const roll = rollMatch[1];
        updatedData.rollNo = roll;
        
        // Parse year and department from roll: NC.SC.U4CSE24229
        const match = roll.match(/U4([A-Z]+)(\d{2})\d*/i);
        if (match) {
          const deptCode = match[1].toUpperCase();
          const batchShort = parseInt(match[2]);
          const batchYear = 2000 + batchShort;
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth();
          let academicYear = currentYear;
          if (currentMonth < 6) academicYear -= 1; // Academic year changes around July
          let yearNum = academicYear - batchYear + 1;
          if (yearNum < 1) yearNum = 1;
          if (yearNum > 4) yearNum = 4;
          
          const yearMap = {
            1: '1st Year',
            2: '2nd Year',
            3: '3rd Year',
            4: '4th Year'
          };
          updatedData.year = yearMap[yearNum] || '1st Year';
          
          const deptMap = {
            'CSE': 'Computer Science and Engineering',
            'AID': 'Artificial Intelligence and Data Science',
            'ECE': 'Electronics Communication Engineering'
          };
          updatedData.department = deptMap[deptCode] || 'Computer Science and Engineering';
        }
      }
    }

    setFormData(updatedData);
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
            <label className="form-label" htmlFor="name">Member 1 — Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                style={styles.input}
                placeholder="Sreeja Veeramalla"
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
                placeholder="NC.SC.U4CSE24229@nc.students.amrita.edu"
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
                placeholder="NC.SC.U4CSE24229"
                value={formData.rollNo}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.rollNo && <span style={styles.errorText}>{errors.rollNo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="year">Year of Study</label>
            <div style={styles.inputWrapper}>
              <Sparkles size={16} style={styles.inputIcon} />
              <select
                id="year"
                name="year"
                className="form-input"
                style={styles.select}
                value={formData.year}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">Department</label>
            <div style={styles.inputWrapper}>
              <User size={16} style={styles.inputIcon} />
              <select
                id="department"
                name="department"
                className="form-input"
                style={styles.select}
                value={formData.department}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
                <option value="Electrical and Communication Engineering">Electrical and Communication Engineering</option>
              </select>
            </div>
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
