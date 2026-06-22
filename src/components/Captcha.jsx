import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function Captcha({ onVerify }) {
  const [isVerified, setIsVerified] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [useTurnstile, setUseTurnstile] = useState(false);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  // Check if Turnstile is available (e.g. if loaded via script)
  useEffect(() => {
    if (window.turnstile) {
      setUseTurnstile(true);
      window.turnstile.render('#turnstile-container', {
        sitekey: '1x00000000000000000000AA', // Mock/testing sitekey, can be updated for production
        callback: (token) => {
          setIsVerified(true);
          onVerify(token);
        },
      });
    }
  }, []);

  const handleMouseDown = () => {
    if (isVerified) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isVerified) return;
    updateSlider(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isVerified) return;
    if (e.touches && e.touches[0]) {
      updateSlider(e.touches[0].clientX);
    }
  };

  const updateSlider = (clientX) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const width = rect.width - 50; // handle width is 50px
    let position = clientX - rect.left - 25; // center on thumb

    if (position < 0) position = 0;
    if (position > width) position = width;

    setSliderPosition(position);

    // If slid past 95% of the width, consider verified
    if (position >= width * 0.95) {
      setIsVerified(true);
      setIsDragging(false);
      setSliderPosition(width);
      onVerify('mock-verification-token');
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!isVerified) {
      // Snap back to start with smooth transition
      setSliderPosition(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <ShieldCheck size={16} color={isVerified ? '#34c759' : '#0071e3'} />
        <span style={styles.title}>
          {isVerified ? 'Verification Successful' : 'Security Verification'}
        </span>
      </div>

      {useTurnstile ? (
        <div id="turnstile-container" style={styles.turnstile}></div>
      ) : (
        <div 
          ref={trackRef} 
          style={{
            ...styles.track,
            borderColor: isVerified ? '#34c759' : 'var(--border)',
            backgroundColor: isVerified ? 'rgba(52, 199, 89, 0.05)' : 'var(--bg-tertiary)'
          }}
        >
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            style={{
              ...styles.handle,
              left: `${sliderPosition}px`,
              cursor: isVerified ? 'default' : 'grab',
              backgroundColor: isVerified ? '#34c759' : 'var(--accent)',
              transform: isDragging ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {isVerified ? (
              <Check size={18} color="#fff" />
            ) : (
              <ArrowRight size={18} color="#fff" />
            )}
          </div>
          <span 
            style={{
              ...styles.trackText,
              opacity: isVerified ? 1 : 0.8 - (sliderPosition / 150),
              color: isVerified ? '#34c759' : 'var(--text-secondary)'
            }}
          >
            {isVerified ? 'You are verified' : 'Slide to verify you are human'}
          </span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    margin: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    userSelect: 'none',
    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.02)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)'
  },
  track: {
    position: 'relative',
    height: 50,
    borderRadius: '25px',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transition: 'border-color 0.3s ease, background-color 0.3s ease'
  },
  handle: {
    position: 'absolute',
    top: 2,
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.1s ease, background-color 0.3s ease'
  },
  trackText: {
    fontSize: '12px',
    fontWeight: '400',
    pointerEvents: 'none',
    transition: 'color 0.3s ease'
  },
  turnstile: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '65px'
  }
};
