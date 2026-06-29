import React, { useState, useEffect } from 'react';
import { Hash, CheckCircle2, AlertCircle, X, ArrowRight, Calendar, User, Mail } from 'lucide-react';

export default function EventRegisterModal({ event, onClose, showNotification }) {
  const [step, setStep] = useState(1); // 1 = Enter ID/Details, 2 = Confirmed
  const [rollId, setRollId] = useState('');
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpening, setIsOpening] = useState(true);

  // Fallback state if member is not found in chapter DB
  const [showFullForm, setShowFullForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('1st Year');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [section, setSection] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setIsOpening(false), 300);
    return () => clearTimeout(t);
  }, []);

  const handleEmailChange = (val) => {
    setEmail(val);
    const emailVal = val.trim().toUpperCase();
    const rollMatch = emailVal.match(/^([A-Z0-9.-]+)@NC\.STUDENTS\.AMRITA\.EDU$/i);
    if (rollMatch) {
      const roll = rollMatch[1];
      setRollId(roll);
      
      const match = roll.match(/U4([A-Z]+)(\d{2})\d*/i);
      if (match) {
        const deptCode = match[1].toUpperCase();
        const batchShort = parseInt(match[2]);
        const batchYear = 2000 + batchShort;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        let academicYear = currentYear;
        if (currentMonth < 6) academicYear -= 1;
        let yearNum = academicYear - batchYear + 1;
        if (yearNum < 1) yearNum = 1;
        if (yearNum > 4) yearNum = 4;
        
        const yearMap = { 1: '1st Year', 2: '2nd Year', 3: '3rd Year', 4: '4th Year' };
        setYear(yearMap[yearNum] || '1st Year');
        
        const deptMap = {
          'CSE': 'Computer Science and Engineering',
          'AID': 'Artificial Intelligence and Data Science',
          'ECE': 'Electronics Communication Engineering'
        };
        setDepartment(deptMap[deptCode] || 'Computer Science and Engineering');
      }
    }
  };

  const handleVerifyId = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const trimmed = rollId.trim().toUpperCase();

      if (!trimmed) {
        setError('Please enter your roll number.');
        return;
      }

      // Check acm_portal_members
      let found = null;
      try {
        const raw = localStorage.getItem('acm_portal_members');
        if (raw) {
          const list = JSON.parse(raw);
          found = list.find(
            (m) =>
              (m.rollNo && m.rollNo.toUpperCase() === trimmed) ||
              (m.studentId && m.studentId.toUpperCase() === trimmed) ||
              (m._id && m._id.toUpperCase() === trimmed)
          );
        }
      } catch (err) {}

      if (found) {
        setMember(found);
        handleRegisterDirect(found);
      } else {
        // Not found - let them register by filling a full form
        setShowFullForm(true);
        setError('No active ACM membership found with this ID. Fill in the form below to auto-join the chapter & register for this event.');
      }
    }, 600);
  };

  const handleRegisterDirect = (memberObj) => {
    try {
      const regKey = `acm_event_registrations_${event._id}`;
      const raw = localStorage.getItem(regKey);
      const list = raw ? JSON.parse(raw) : [];

      // Check duplicate
      const isAlreadyReg = list.some(
        (r) => r.member?.studentId?.toUpperCase() === (memberObj.studentId || memberObj.rollNo)?.toUpperCase()
      );

      if (isAlreadyReg) {
        showNotification('info', 'Already Registered', 'You are already registered for this event.');
        onClose();
        return;
      }

      const newReg = {
        _id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        eventId: event._id,
        member: {
          name: memberObj.name,
          email: memberObj.email,
          studentId: memberObj.studentId || memberObj.rollNo,
          rollNo: memberObj.rollNo || memberObj.studentId,
          year: memberObj.year || '1st Year',
          department: memberObj.department || 'Computer Science and Engineering',
          section: memberObj.section || 'A'
        },
        status: 'confirmed',
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem(regKey, JSON.stringify([...list, newReg]));

      // Log audit
      const logsRaw = localStorage.getItem('acm_audit_logs');
      const logs = logsRaw ? JSON.parse(logsRaw) : [];
      const newLog = {
        _id: `log-${Date.now()}`,
        action: 'EVENT_REGISTRATION',
        resource: 'events',
        details: `Student ${memberObj.name} registered for ${event.title}`,
        severity: 'info',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('acm_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 200)));

      setStep(2);
      showNotification('success', 'Event Registered', `Successfully registered for "${event.title}"`);
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  const handleFullFormSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !rollId.trim()) {
      setError('Please fill in Name, Email and Roll Number.');
      return;
    }

    // Auto register member in ACM chapter DB
    const newMember = {
      _id: `ACM-${Math.floor(100000 + Math.random() * 900000)}`,
      name: fullName,
      email,
      rollNo: rollId.trim().toUpperCase(),
      studentId: rollId.trim().toUpperCase(),
      year,
      department,
      section: section || 'A',
      status: 'active',
      type: 'student',
      role: 'Member',
      joinedAt: new Date().toISOString()
    };

    try {
      const memRaw = localStorage.getItem('acm_portal_members');
      const memList = memRaw ? JSON.parse(memRaw) : [];
      localStorage.setItem('acm_portal_members', JSON.stringify([newMember, ...memList]));

      // Also register for the event
      handleRegisterDirect(newMember);
    } catch (err) {
      setError('Failed to create registration.');
    }
  };

  return (
    <div className={`modal-overlay ${isOpening ? 'is-opening' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div style={styles.header}>
          <div style={styles.logoBg}>
            <Calendar size={22} color="#ffffff" />
          </div>
          <h2 style={styles.title}>Register for Program</h2>
          <p style={styles.subtitle}>{event.title}</p>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!showFullForm ? (
              <form onSubmit={handleVerifyId} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="verifyRoll">Enter Roll Number / Student ID</label>
                  <div style={styles.inputWrapper}>
                    <Hash size={16} style={styles.inputIcon} />
                    <input
                      id="verifyRoll"
                      type="text"
                      className="form-input"
                      style={styles.input}
                      placeholder="NC.SC.U4CSE24229"
                      value={rollId}
                      onChange={(e) => setRollId(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <div style={styles.errorBanner}>
                      <AlertCircle size={15} color="#ff453a" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#ff453a' }}>{error}</span>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={styles.btn} disabled={isLoading || !rollId.trim()}>
                  {isLoading ? <span style={styles.spinner} /> : <>Verify & Register <ArrowRight size={16} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleFullFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={styles.errorBanner}>
                  <AlertCircle size={15} color="#ff9f0a" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '11.5px', color: '#ff9f0a' }}>Chapter membership registration is required. Fill the form to auto-join.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={styles.inputWrapper}>
                    <User size={14} style={styles.inputIcon} />
                    <input type="text" className="form-input" style={styles.input} placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Amrita Email</label>
                  <div style={styles.inputWrapper}>
                    <Mail size={14} style={styles.inputIcon} />
                    <input type="email" className="form-input" style={styles.input} placeholder="NC.SC.U4CSE24229@nc.students.amrita.edu" value={email} onChange={(e) => handleEmailChange(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Year of Study</label>
                    <select className="form-input" style={styles.select} value={year} onChange={(e) => setYear(e.target.value)}>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <input type="text" className="form-input" style={styles.input} placeholder="A" value={section} onChange={(e) => setSection(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" style={styles.select} value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="Computer Science and Engineering">CSE</option>
                    <option value="Artificial Intelligence and Data Science">AID</option>
                    <option value="Electrical and Communication Engineering">ECE</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={styles.btn}>
                  Register & Join Chapter
                </button>
              </form>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={styles.successWrapper}>
            <div style={styles.successIcon}>
              <CheckCircle2 size={44} color="#34c759" />
            </div>
            <h3 style={styles.successTitle}>Registration Confirmed!</h3>
            <p style={styles.successDesc}>
              You have secured a seat for <strong>{event.title}</strong>. An email pass and calendar invitation will be dispatched shortly.
            </p>
            <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  logoBg: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-tertiary)',
    pointerEvents: 'none'
  },
  input: {
    paddingLeft: '38px',
    width: '100%'
  },
  select: {
    width: '100%',
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '14px'
  },
  btn: {
    width: '100%',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block'
  },
  errorBanner: {
    display: 'flex',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,69,58,0.06)',
    border: '1px solid rgba(255,69,58,0.15)',
    marginTop: '8px'
  },
  successWrapper: {
    textAlign: 'center',
    padding: '10px 0'
  },
  successIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  successDesc: {
    fontSize: '13.5px',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
    margin: '10px 0 20px'
  }
};
