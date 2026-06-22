import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Terminal } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onJoinClick, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [prevTheme, setPrevTheme] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleThemeChange = (newTheme) => {
    if (newTheme === theme) return;
    setPrevTheme(theme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dim');
    if (theme !== 'dark') {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
    
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [theme]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' },
    { id: 'core-committee', label: 'Core Committee' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'sig', label: 'SIG' },
    { id: 'contact', label: 'Contact' },
    { id: 'admin', label: 'Portal' }
  ];

  const megaMenuData = {
    events: {
      title: 'Featured Programs',
      sections: [
        {
          heading: 'Explore Events',
          links: [
            { label: 'Upcoming Workshops', desc: 'Practical hands-on coding bootcamps', href: '#events' },
            { label: 'ACM HackNights', desc: '24-hour intense coding sprints', href: '#events' },
            { label: 'SIG Coding Meetups', desc: 'Weekly sub-chapter discussions', href: '#events' }
          ]
        },
        {
          heading: 'Quick Links',
          links: [
            { label: 'Register for Events', action: 'join' },
            { label: 'Event Calendars', href: '#events' },
            { label: 'Past Events Archive', href: '#events' }
          ]
        },
        {
          heading: 'Specialized Tracks',
          links: [
            { label: 'AI & ML Bootcamps', desc: 'Gemini developer integrations', href: '#events' },
            { label: 'Hardening Hacknights', desc: 'Secure web app development', href: '#events' }
          ]
        }
      ]
    },
    about: {
      title: 'About the Chapter',
      sections: [
        {
          heading: 'Our Foundations',
          links: [
            { label: 'Chapter Mission', href: '#about' },
            { label: 'Amrita Heritage', href: '#about' },
            { label: 'ACM Global Network', href: 'https://acm.org', target: '_blank' }
          ]
        },
        {
          heading: 'Quick Links',
          links: [
            { label: 'Official Charter Info', href: '#about' },
            { label: 'Key Metrics & Stats', href: '#about' }
          ]
        }
      ]
    },
    'core-committee': {
      title: 'Student Leadership',
      sections: [
        {
          heading: 'Executive Board',
          links: [
            { label: 'Student Chair', href: '#core-committee' },
            { label: 'Vice-Chair', href: '#core-committee' },
            { label: 'Secretary & Treasurer', href: '#core-committee' }
          ]
        },
        {
          heading: 'Technical Leads',
          links: [
            { label: 'Webmaster Division', href: '#core-committee' },
            { label: 'SIG Developers', href: '#core-committee' }
          ]
        }
      ]
    },
    faculty: {
      title: 'Advisory Mentorship',
      sections: [
        {
          heading: 'Academic Sponsors',
          links: [
            { label: 'Faculty Sponsor', href: '#faculty' },
            { label: 'Co-Sponsors Board', href: '#faculty' }
          ]
        },
        {
          heading: 'Department Division',
          links: [
            { label: 'Computer Science Dept', href: 'https://amrita.edu', target: '_blank' }
          ]
        }
      ]
    },
    sig: {
      title: 'Special Interest Groups',
      sections: [
        {
          heading: 'Explore SIGs',
          links: [
            { label: 'SIG-Web', href: '#sig' },
            { label: 'SIG-AI/ML', href: '#sig' },
            { label: 'SIG-CP', href: '#sig' },
            { label: 'SIG-CyberSecurity', href: '#sig' }
          ]
        },
        {
          heading: 'SIG Resources',
          links: [
            { label: 'Learning Syllabus', href: '#sig' },
            { label: 'GitHub Repositories', href: 'https://github.com', target: '_blank' }
          ]
        }
      ]
    },
    contact: {
      title: 'Connect & Support',
      sections: [
        {
          heading: 'Direct Inquiries',
          links: [
            { label: 'Helpdesk Email', href: 'mailto:acm@ng.amrita.edu' },
            { label: 'Campus Office Location', href: '#contact' }
          ]
        },
        {
          heading: 'Quick Actions',
          links: [
            { label: 'Send Message Inquiry', href: '#contact' },
            { label: 'Join Our Community', action: 'join' }
          ]
        }
      ]
    }
  };

  return (
    <nav className="navbar glass-container" onMouseLeave={() => setHoveredItem(null)}>
      <div className="glass-filter"></div>
      <div className="glass-overlay"></div>
      <div className="glass-specular"></div>

      {/* SVG FILTER DEFINITION FOR REFRACTIVE GLASS */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg>
          <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      </div>

      <div className="glass-content navbar-container">
        {/* Left ACM Brand Logo */}
        <div 
          onClick={() => {
            setActiveTab('home');
            setHoveredItem(null);
          }} 
          onMouseEnter={() => setHoveredItem(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative', zIndex: 10 }}
        >
          <Terminal size={18} color="var(--accent)" />
          <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            ACM Amrita
          </span>
        </div>

        {/* Center Desktop Links */}
        <ul className="nav-links" style={styles.desktopLinks}>
          {navItems.map((item) => (
            <li 
              key={item.id}
              onMouseEnter={() => {
                if (megaMenuData[item.id]) {
                  setHoveredItem(item.id);
                } else {
                  setHoveredItem(null);
                }
              }}
            >
              <a
                href={item.id === 'admin' ? '/admin' : `#${item.id}`}
                onClick={(e) => {
                  if (item.id === 'admin') {
                    return; // let default href action occur for admin portal route
                  }
                  e.preventDefault();
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                  setHoveredItem(null);
                }}
                className={activeTab === item.id ? 'active' : ''}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Desktop CTA + Theme Switcher */}
        <div style={styles.rightActions} onMouseEnter={() => setHoveredItem(null)}>
          <fieldset 
            className={`switcher ${isTransitioning ? 'is-transitioning' : ''}`} 
            data-theme={theme} 
            c-previous={prevTheme === 'light' ? '1' : prevTheme === 'dark' ? '2' : '3'}
            style={{ marginRight: '8px' }}
          >
            <legend className="switcher__legend">Choose theme</legend>
            
            <label className="switcher__option" title="Light Mode">
              <input 
                className="switcher__input" 
                type="radio" 
                name="theme" 
                value="light" 
                c-option="1"
                checked={theme === 'light'} 
                onChange={() => handleThemeChange('light')} 
              />
              <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
                <path fill="currentColor" fillRule="evenodd" d="M18 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" clip-rule="evenodd" />
                <path fill="currentColor" d="M17 6.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 7.742a1 1 0 1 1 1.618 1.176L24.1 11.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 13.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM29.722 20.795a1 1 0 0 1-.619 1.902l-2.853-.927a1 1 0 1 1 .618-1.902l2.854.927ZM25.862 27.159a1 1 0 0 1-1.618 1.175l-1.763-2.427a1 1 0 1 1 1.618-1.175l1.763 2.427ZM19 30.038a1 1 0 0 1-2 0v-3a1 1 0 1 1 2 0v3ZM11.755 28.334a1 1 0 0 1-1.618-1.175l1.764-2.427a1 1 0 1 1 1.618 1.175l-1.764 2.427ZM6.896 22.697a1 1 0 1 1-.618-1.902l2.853-.927a1 1 0 1 1 .618 1.902l-2.853.927ZM6.278 15.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 8.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z" />
              </svg>
            </label>

            <label className="switcher__option" title="Dark Mode">
              <input 
                className="switcher__input" 
                type="radio" 
                name="theme" 
                value="dark" 
                c-option="2"
                checked={theme === 'dark'} 
                onChange={() => handleThemeChange('dark')} 
              />
              <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
                <path fill="currentColor" d="M12.5 8.473a10.968 10.968 0 0 1 8.785-.97 7.435 7.435 0 0 0-3.737 4.672l-.09.373A7.454 7.454 0 0 0 28.732 20.4a10.97 10.97 0 0 1-5.232 7.125l-.497.27c-5.014 2.566-11.175.916-14.234-3.813l-.295-.483C5.53 18.403 7.13 11.93 12.017 8.77l.483-.297Zm4.234.616a8.946 8.946 0 0 0-2.805.883l-.429.234A9 9 0 0 0 10.206 22.5l.241.395A9 9 0 0 0 22.5 25.794l.416-.255a8.94 8.94 0 0 0 2.167-1.99 9.433 9.433 0 0 1-2.782-.313c-5.043-1.352-8.036-6.535-6.686-11.578l.147-.491c.242-.745.573-1.44.972-2.078Z" />
              </svg>
            </label>

            <label className="switcher__option" title="Dim Slate Mode">
              <input 
                className="switcher__input" 
                type="radio" 
                name="theme" 
                value="dim" 
                c-option="3"
                checked={theme === 'dim'} 
                onChange={() => handleThemeChange('dim')} 
              />
              <svg className="switcher__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
                <path fill="currentColor" d="M5 21a1 1 0 0 1 1-1h24a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM12 25a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1ZM15 29a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM18 13a6 6 0 0 1 5.915 7h-2.041A4.005 4.005 0 0 0 18 15a4 4 0 0 0-3.874 5h-2.041A6 6 0 0 1 18 13ZM17 7.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 8.742a1 1 0 1 1 1.618 1.176L24.1 12.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 14.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM6.278 16.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 9.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z" />
              </svg>
            </label>

            <div className="switcher__toggle"></div>

            <div className="switcher__filter">
              <svg>
                <filter id="switcher" primitiveUnits="objectBoundingBox">
                  <feImage result="map" width="100%" height="100%" x="0" y="0"
                    href="data:image/webp;base64,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" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.005" result="blur" />
                  <feDisplacementMap id="disp" in="blur" in2="map" scale="0.5" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </svg>
            </div>
          </fieldset>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={styles.userText}>{user.name.split(' ')[0]}</span>
              <button 
                onClick={onLogout} 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onJoinClick} 
              className="btn btn-primary" 
              style={styles.joinBtn}
            >
              Join Chapter
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            style={styles.mobileMenuToggle}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mega Dropdown Panel */}
      {hoveredItem && megaMenuData[hoveredItem] && (
        <div className="mega-dropdown-panel animate-slide-down">
          <div className="mega-dropdown-container">
            <div className="mega-dropdown-grid">
              <div className="mega-dropdown-column main-col">
                <div className="mega-dropdown-label">Explore</div>
                <h3 className="mega-dropdown-title">{megaMenuData[hoveredItem].title}</h3>
              </div>
              {megaMenuData[hoveredItem].sections.map((sec, idx) => (
                <div className="mega-dropdown-column" key={idx}>
                  <div className="mega-dropdown-section-heading">{sec.heading}</div>
                  <ul className="mega-dropdown-links-list">
                    {sec.links.map((link, lIdx) => (
                      <li key={lIdx} className="mega-dropdown-link-item">
                        {link.action === 'join' ? (
                          <button
                            onClick={() => {
                              onJoinClick();
                              setHoveredItem(null);
                            }}
                            className="mega-dropdown-link-btn"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <a
                            href={link.href}
                            target={link.target}
                            onClick={(e) => {
                              if (link.href && link.href.startsWith('#')) {
                                e.preventDefault();
                                setActiveTab(link.href.slice(1));
                              }
                              setHoveredItem(null);
                            }}
                            className="mega-dropdown-link"
                          >
                            <span className="link-text">{link.label}</span>
                            {link.desc && <span className="link-desc">{link.desc}</span>}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown Panel */}
      {isMenuOpen && (
        <div style={styles.mobileMenuPanel}>
          <ul style={styles.mobileNavLinks}>
            {navItems.map((item) => (
              <li key={item.id} style={styles.mobileNavItem}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  style={{
                    ...styles.mobileNavLink,
                    color: activeTab === item.id ? 'var(--accent)' : 'var(--text-primary)'
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li style={{ ...styles.mobileNavItem, marginTop: '20px' }}>
              {user ? (
                <button 
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                >
                  Sign Out ({user.name})
                </button>
              ) : (
                <button 
                  onClick={() => {
                    onJoinClick();
                    setIsMenuOpen(false);
                  }} 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                >
                  Join Chapter
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

const styles = {
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  themeToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '50%',
    transition: 'color 0.2s ease',
    outline: 'none'
  },
  joinBtn: {
    padding: '6px 14px',
    fontSize: '12px',
    borderRadius: '12px',
    fontWeight: '500'
  },
  userText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '500'
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    padding: '4px',
    outline: 'none'
  },
  mobileMenuPanel: {
    position: 'absolute',
    top: '48px',
    left: 0,
    right: 0,
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    padding: '24px 22px',
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.2s ease-out',
    zIndex: 998
  },
  mobileNavLinks: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  mobileNavItem: {
    width: '100%'
  },
  mobileNavLink: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 0',
    borderBottom: '1px solid var(--border)'
  },
  // Responsive display styles using standard CSS rules inside JS (or inline media queries check)
  '@media (max-width: 768px)': {
    desktopLinks: {
      display: 'none'
    },
    joinBtn: {
      display: 'none'
    },
    mobileMenuToggle: {
      display: 'flex'
    }
  }
};

// Inject media queries dynamically for clean responsiveness
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      .nav-links { display: none !important; }
      .navbar-container .btn-primary { display: none !important; }
      .navbar-container .btn-secondary { display: none !important; }
      .navbar-container span { display: none !important; }
      nav button[title*="Switch"] { margin-right: 8px; }
      nav button:last-child { display: flex !important; }
    }
    @media (min-width: 769px) {
      nav button:last-child { display: none !important; }
    }
  `;
  document.head.appendChild(styleSheet);
}
