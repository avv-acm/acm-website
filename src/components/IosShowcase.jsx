import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Bell, Layers, Sparkles } from 'lucide-react';

export default function IosShowcase() {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(60); // simulated percentage
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  // Live time and date calculations
  useEffect(() => {
    const updateTimeDate = () => {
      const now = new Date();
      
      // Time: HH:MM
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      // Date format: Day of week, Month Day
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      setDateStr(`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`);
    };

    updateTimeDate();
    const interval = setInterval(updateTimeDate, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallax background tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to percentage offsets from center (range roughly -15px to 15px)
    const xPercent = ((x / rect.width) - 0.5) * 20;
    const yPercent = ((y / rect.height) - 0.5) * 20;
    
    setBgPos({
      x: 50 + xPercent,
      y: 50 + yPercent
    });
  };

  const handleMouseLeave = () => {
    setBgPos({ x: 50, y: 50 });
  };

  // Simulated progress bar updates when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="ios-showcase-wrapper">
      {/* Title / Info Header mimicking Themes folder */}
      <div className="ios-showcase-title">
        <div className="title-badge">
          <Sparkles size={12} color="var(--accent)" />
          <span>Interactive Preview</span>
        </div>
        <h3 className="ios-main-title">ACM Live Node</h3>
        <p className="ios-sub-title">Interact with the device to preview our live chapter notification system and sandbox controls.</p>
      </div>

      {/* Simulated iPhone Frame */}
      <div 
        ref={containerRef}
        className="iphone-frame" 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundPosition: `${bgPos.x}% ${bgPos.y}%`
        }}
      >
        {/* Notch / Dynamic Island */}
        <div className="iphone-island"></div>

        {/* Lockscreen Header (Date & Time) */}
        <div className="ios-date-time">
          <div className="ios-date">{dateStr}</div>
          <div className="ios-time">{time}</div>
        </div>

        {/* Liquid Glass Notifications Container */}
        <div className="ios-notifications-list">
          {/* Notification 1 */}
          <div className="ios-notification ios-glass-card">
            <div className="ios-noti-icon-container">
              <Bell size={18} color="var(--accent)" />
            </div>
            <div className="ios-noti-content">
              <div className="ios-noti-app">
                <span>ACM Chapter</span>
                <span className="ios-noti-time">now</span>
              </div>
              <div className="ios-noti-title">CodeCraft Hackathon '26</div>
              <div className="ios-noti-desc">Registrations are officially open! Grab your seats.</div>
            </div>
          </div>

          {/* Notification 2 */}
          <div className="ios-notification ios-glass-card">
            <div className="ios-noti-icon-container" style={{ background: 'rgba(255,100,100,0.15)' }}>
              <Layers size={18} color="#ff6b6b" />
            </div>
            <div className="ios-noti-content">
              <div className="ios-noti-app">
                <span>DevSandbox</span>
                <span className="ios-noti-time">2m ago</span>
              </div>
              <div className="ios-noti-title">Database Concurrency Safe</div>
              <div className="ios-noti-desc">Firebase scaling verified for 5000+ active connections.</div>
            </div>
          </div>
        </div>

        {/* Simulated iOS Music Player Widget */}
        <div className="ios-player ios-glass-card">
          <div className="ios-player-header">
            <div className="ios-player-info">
              <div className="ios-player-song">Web Development Sandbox</div>
              <div className="ios-player-artist">ACM Amrita Nagercoil</div>
            </div>
            <div className="ios-music-wave">
              <span className={`wave-bar ${isPlaying ? 'playing' : ''}`}></span>
              <span className={`wave-bar ${isPlaying ? 'playing' : ''}`}></span>
              <span className={`wave-bar ${isPlaying ? 'playing' : ''}`}></span>
            </div>
          </div>

          <div className="ios-track-slider">
            <span className="ios-track-time">1:05</span>
            <div className="ios-track-line-bg">
              <div className="ios-track-line-progress" style={{ width: `${trackProgress}%` }}></div>
            </div>
            <span className="ios-track-time">-{Math.max(0, Math.floor(3 - (trackProgress / 33)))}:{(30 - Math.floor(trackProgress % 30)).toString().padStart(2, '0')}</span>
          </div>

          <div className="ios-player-controls">
            <button className="ios-ctrl-btn" onClick={() => setTrackProgress(Math.max(0, trackProgress - 10))}>
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button className="ios-ctrl-btn ios-play-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button className="ios-ctrl-btn" onClick={() => setTrackProgress(Math.min(100, trackProgress + 10))}>
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Home Indicator line */}
        <div className="iphone-home-indicator"></div>
      </div>
    </div>
  );
}
