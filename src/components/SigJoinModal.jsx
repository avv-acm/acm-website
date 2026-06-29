import React, { useState, useEffect } from 'react';
import { Hash, CheckCircle2, AlertCircle, X, ArrowRight, Users, Layers } from 'lucide-react';

const SIG_LABELS = {
  'ai-ml': { name: 'SIG-AI/ML', color: '#af52de' },
  'web-dev': { name: 'SIG-Web', color: '#0071e3' },
  'security': { name: 'SIG-CyberSecurity', color: '#ff453a' },
  'cp': { name: 'SIG-CP', color: '#ff9f0a' },
};

export default function SigJoinModal({ sigKey, sigTitle, onClose, showNotification }) {
  const [step, setStep] = useState(1); // 1 = enter ID, 2 = confirm join
  const [rollId, setRollId] = useState('');
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isOpening, setIsOpening] = useState(true);

  const sigInfo = SIG_LABELS[sigKey] || { name: sigTitle || 'SIG', color: 'var(--accent)' };

  useEffect(() => {
    const t = setTimeout(() => setIsOpening(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Check if they already joined this SIG
  useEffect(() => {
    if (member) {
      const joinedSigs = JSON.parse(localStorage.getItem('acm_sig_joins') || '{}');
      const key = `${member.rollNo || member.id}::${sigKey}`;
      if (joinedSigs[key]) {
        setIsJoined(true);
        setStep(2);
      }
    }
  }, [member, sigKey]);

  const handleVerifyId = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const trimmed = rollId.trim().toUpperCase();

      // Look up member in localStorage (from ACM registrations)
      let found = null;

      // Check acm_portal_members (admin-managed list)
      try {
        const raw = localStorage.getItem('acm_portal_members');
        if (raw) {
          const list = JSON.parse(raw);
          found = list.find(
            (m) =>
              (m.rollNo && m.rollNo.toUpperCase() === trimmed) ||
              (m.id && m.id.toUpperCase() === trimmed)
          );
        }
      } catch {}

      // Also check acm_members (legacy / firebase-synced list)
      if (!found) {
        try {
          const raw2 = localStorage.getItem('acm_members');
          if (raw2) {
            const list2 = JSON.parse(raw2);
            found = list2.find(
              (m) =>
                (m.rollNo && m.rollNo.toUpperCase() === trimmed) ||
                (m.id && m.id.toUpperCase() === trimmed)
            );
          }
        } catch {}
      }

      if (found) {
        setMember(found);
        setStep(2);
      } else {
        setError('No ACM membership found with this ID. Please register as an ACM member first using the "Join Chapter" button.');
      }
    }, 800);
  };

  const handleJoinSig = () => {
    if (!member) return;
    const joinedSigs = JSON.parse(localStorage.getItem('acm_sig_joins') || '{}');
    const key = `${member.rollNo || member.id}::${sigKey}`;
    joinedSigs[key] = {
      memberId: member.rollNo || member.id,
      memberName: member.name,
      sigKey,
      sigName: sigInfo.name,
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem('acm_sig_joins', JSON.stringify(joinedSigs));
    setIsJoined(true);

    if (showNotification) {
      showNotification('success', 'SIG Joined! 🎉', `You have successfully joined ${sigInfo.name}.`);
    }

    setTimeout(() => onClose(), 1800);
  };

  return (
    <div
      className={`modal-overlay ${isOpening ? 'is-opening' : ''}`}
      onClick={onClose}
      style={{ zIndex: 1050 }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px', padding: '36px 32px' }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: `${sigInfo.color}22`,
            border: `1.5px solid ${sigInfo.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <Layers size={24} color={sigInfo.color} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Join {sigInfo.name}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {step === 1
              ? 'ACM membership is required to join a SIG group.'
              : isJoined
              ? `You're now a member of ${sigInfo.name}!`
              : `Confirm your membership and join ${sigInfo.name}.`}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: step >= s ? 'var(--accent)' : 'var(--bg-elevated)',
                border: `1.5px solid ${step >= s ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700,
                color: step >= s ? '#fff' : 'var(--text-tertiary)',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}>
                {s}
              </div>
              {s < 2 && (
                <div style={{
                  height: '2px', width: '32px',
                  background: step > 1 ? 'var(--accent)' : 'var(--border)',
                  borderRadius: '2px',
                  transition: 'background 0.4s ease',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── STEP 1: Enter Roll ID ── */}
        {step === 1 && (
          <form onSubmit={handleVerifyId} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="sig-roll-id">
                Your ACM Member Roll ID
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Hash size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="sig-roll-id"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '42px', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}
                  placeholder="NC.SC.U4CSE24229"
                  value={rollId}
                  onChange={(e) => { setRollId(e.target.value); setError(''); }}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {error && (
                <div style={{
                  display: 'flex', gap: '8px', alignItems: 'flex-start',
                  marginTop: '10px', padding: '12px', borderRadius: '10px',
                  background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)',
                  animation: 'fadeIn 0.3s ease',
                }}>
                  <AlertCircle size={15} color="#ff453a" style={{ marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#ff453a', lineHeight: 1.5 }}>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !rollId.trim()}
              style={{
                width: '100%', padding: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: !rollId.trim() ? 0.5 : 1,
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {isLoading ? (
                <span style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block',
                }} />
              ) : (
                <>Verify Membership <ArrowRight size={16} /></>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Not a member yet?{' '}
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', color: 'var(--accent)',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  transition: 'color 0.4s ease',
                }}
              >
                Join ACM first →
              </button>
            </p>
          </form>
        )}

        {/* ── STEP 2: Confirm & Join ── */}
        {step === 2 && !isJoined && member && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Member card */}
            <div style={{
              padding: '16px', borderRadius: '12px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              display: 'flex', gap: '14px', alignItems: 'center',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(var(--accent-rgb),0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700, color: 'var(--accent)',
                flexShrink: 0,
              }}>
                {(member.name || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {member.rollNo || member.id} • {member.year || ''} {member.department ? `• ${member.department.split(' ').slice(0,2).join(' ')}` : ''}
                </div>
              </div>
              <CheckCircle2 size={20} color="#34c759" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </div>

            {/* SIG badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '12px',
              background: `${sigInfo.color}11`,
              border: `1px solid ${sigInfo.color}33`,
            }}>
              <Users size={16} color={sigInfo.color} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: sigInfo.color }}>
                Joining: {sigInfo.name}
              </span>
            </div>

            <button
              onClick={handleJoinSig}
              className="btn btn-primary"
              style={{
                width: '100%', padding: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: sigInfo.color,
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <Users size={16} /> Confirm & Join {sigInfo.name}
            </button>
          </div>
        )}

        {/* ── Joined Success ── */}
        {isJoined && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(52,199,89,0.12)',
              border: '2px solid rgba(52,199,89,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle2 size={32} color="#34c759" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#34c759', marginBottom: '8px' }}>
              Welcome to {sigInfo.name}!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              You've successfully joined the group. Stay tuned for upcoming sessions!
            </p>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
