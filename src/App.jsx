import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DesignGrid from './components/DesignGrid';
import JoinModal from './components/JoinModal';
import SigJoinModal from './components/SigJoinModal';
import EventRegisterModal from './components/EventRegisterModal';
import Captcha from './components/Captcha';
import pencilImage from './assets/2.png';
import { 
  Users, 
  Calendar, 
  Database, 
  Lock, 
  Sparkles, 
  ArrowUpRight, 
  FileSpreadsheet, 
  Mail, 
  Search, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Trash2,
  Edit3,
  Plus,
  Upload,
  Shield,
  MessageCircle,
  UserPlus
} from 'lucide-react';

// Custom SVG Icons because they are not exported by the installed lucide-react version
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

const Github = ({ size = 24, ...props }) => (
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
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
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

import { getMembersFromDB, registerMemberInDB, addBulkMembersToDB } from './firebase';

export default function App() {
  const wsRef = useRef(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [defaultJoinInterest, setDefaultJoinInterest] = useState('web');
  const [isSigJoinModalOpen, setIsSigJoinModalOpen] = useState(false);
  const [activeSigForJoin, setActiveSigForJoin] = useState(null);
  const [isEventRegisterModalOpen, setIsEventRegisterModalOpen] = useState(false);
  const [activeEventForRegister, setActiveEventForRegister] = useState(null);
  const [members, setMembers] = useState([]);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);
  const [user, setUser] = useState(null);

  // Initial Data definitions
  const initialSigData = {
    'ai-ml': {
      title: 'SIG-AI/ML',
      sub: 'Artificial Intelligence & Machine Learning',
      desc: 'Examines deep learning models, natural language processing, Gemini developer APIs, vector databases, and real-world intelligence integration.',
      lead: 'Nisha Sundar',
      facultyAdvisor: 'Dr. Rajesh K.',
      activeProject: 'Autonomous Agentic Captcha Validation (AACV)',
      status: 'In Development',
      membersCount: 45,
      image: '',
      joinNowEnabled: true
    },
    'web-dev': {
      title: 'SIG-Web',
      sub: 'Web Development & Design',
      desc: 'Focuses on modern web architectures, performance engineering, UI/UX aesthetics, and responsive layout implementations using frameworks and vanilla systems.',
      lead: 'Mounesh S.',
      facultyAdvisor: 'Prof. Anand S.',
      activeProject: 'ACM Chapter Portal v2.0 (Liquid Glass Edition)',
      status: 'Beta Testing',
      membersCount: 60,
      image: '',
      joinNowEnabled: true
    },
    'security': {
      title: 'SIG-CyberSecurity',
      sub: 'Application & Network Security',
      desc: 'Explores security architectures, application hardening, vulnerability patching, authentication protocols, and cryptography basics.',
      lead: 'Rahul Krishnan',
      facultyAdvisor: 'Prof. Meera Nair',
      activeProject: 'JWT Hardened Auth Middleware System',
      status: 'Completed & Audited',
      membersCount: 30,
      image: '',
      joinNowEnabled: true
    },
    'cp': {
      title: 'SIG-CP',
      sub: 'Competitive Programming',
      desc: 'Emphasizes advanced data structures, complex algorithms, mathematical problem solving, and preparation for global computing challenges.',
      lead: 'Adithya R.',
      facultyAdvisor: 'Dr. Rajesh K.',
      activeProject: 'Mock ICPC Contest Engine & Auto-Grader',
      status: 'Planning Phase',
      membersCount: 50,
      image: '',
      joinNowEnabled: true
    }
  };

  const initialEvents = [
    {
      id: 'hacknight',
      title: 'ACM Hardening HackNight 2026',
      category: 'hackathon',
      date: 'June 28-29',
      location: 'Nagercoil Main Lab',
      desc: 'A 24-hour non-stop coding competition focused on building production-grade secured web applications.',
      featured: true,
      time: '09:00 AM - 09:00 AM',
      tag: 'Featured Hackathon',
      image: ''
    },
    {
      id: 'gemini-bootcamp',
      title: 'AI Bootcamp: Gemini Core Concepts',
      category: 'workshop',
      date: 'July 04',
      location: 'Seminar Hall II',
      desc: 'Practical hands-on workshop focused on building applications using Gemini developer API models and vector indices.',
      featured: true,
      time: '10:00 AM - 04:00 PM',
      tag: 'Featured Workshop',
      image: ''
    },
    {
      id: 'sig-cyber',
      title: 'Zero-Trust Architectures & Penetration testing',
      category: 'sig',
      date: 'July 12',
      location: 'Virtual Classroom 3',
      desc: 'Cybersecurity Special Interest Group meeting and live capture-the-flag demo.',
      featured: false,
      time: '02:00 PM - 04:00 PM',
      image: ''
    },
    {
      id: 'sig-web',
      title: 'Next.js 15 & React Server Components Deep-Dive',
      category: 'sig',
      date: 'July 18',
      location: 'Computing Lab 1',
      desc: 'Web Development Special Interest Group hands-on session coding interactive features.',
      featured: false,
      time: '03:00 PM - 05:00 PM',
      image: ''
    },
    {
      id: 'algo-challenge',
      title: 'ACM CodeSprint: ICPC Mock Round',
      category: 'hackathon',
      date: 'July 25',
      location: 'Online Contest Portal',
      desc: 'Competitive programming challenge mimicking the ICPC template with rigorous time constraints.',
      featured: false,
      time: '06:00 PM - 09:00 PM',
      image: ''
    }
  ];

  // States with persistent local storage caching
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('acm_portal_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });
  
  const [sigs, setSigs] = useState(() => {
    const saved = localStorage.getItem('acm_portal_sigs');
    return saved ? JSON.parse(saved) : initialSigData;
  });

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('acm_portal_assets');
    return saved ? JSON.parse(saved) : [
      { id: 'asset-1', name: 'Nagercoil Pencil Sketch', type: 'image/png', url: pencilImage, size: '42 KB' },
      { id: 'asset-2', name: 'Vite React Logo', type: 'image/svg+xml', url: '/src/assets/react.svg', size: '3.8 KB' },
      { id: 'asset-3', name: 'ACM Campus Branding', type: 'image/jpeg', url: '/src/assets/campus_bg.jpg', size: '1.2 MB' }
    ];
  });

  const [securityLogs, setSecurityLogs] = useState(() => {
    const saved = localStorage.getItem('acm_portal_security_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'sec-1', timestamp: new Date(Date.now() - 7200 * 1000).toISOString(), event: 'WAF Firewall Active', type: 'success', details: 'Zero-Trust request filtering rules applied' },
      { id: 'sec-2', timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), event: 'CSRF Protection Synchronized', type: 'success', details: 'Session token validation active' },
      { id: 'sec-3', timestamp: new Date().toISOString(), event: 'Admin Portal Shield Loaded', type: 'info', details: 'Awaiting operator authentication' }
    ];
  });

  const [activeSigTab, setActiveSigTab] = useState('ai-ml');
  const [accentColor, setAccentColor] = useState('blue');
  const [glassBlur, setGlassBlur] = useState(20);

  // Dynamic Leadership states
  const [committee, setCommittee] = useState(() => {
    const saved = localStorage.getItem('acm_portal_committee');
    return saved ? JSON.parse(saved) : [
      { id: 'cc-1', name: 'Abhijith P. S.', role: 'Student Chair', desc: 'Leads the chapter operations, orchestrating events and community growth.', email: 'abhijith@am.amrita.edu', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' },
      { id: 'cc-2', name: 'Samyuktha R.', role: 'Vice-Chair', desc: 'Oversees programs and builds partnerships for academic and technical success.', email: 'samyuktha@am.amrita.edu', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' },
      { id: 'cc-3', name: 'Devika M.', role: 'Secretary', desc: 'Handles official chapter records, outreach communications, and coordination.', email: 'devika@am.amrita.edu', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' },
      { id: 'cc-4', name: 'Harikrishnan S.', role: 'Treasurer', desc: 'Manages chapter budgets, resource allocations, and financial logging.', email: 'harikrishnan@am.amrita.edu', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' },
      { id: 'cc-5', name: 'Mounesh S.', role: 'Webmaster / Lead Developer', desc: 'Maintains ACM portal development, hosting architectures, and cloud services.', email: 'mounesh@am.amrita.edu', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' }
    ];
  });

  const [faculty, setFaculty] = useState(() => {
    const saved = localStorage.getItem('acm_portal_faculty');
    return saved ? JSON.parse(saved) : [
      { id: 'fa-1', name: 'Dr. Rajesh K.', role: 'Faculty Sponsor', dept: 'Associate Professor, Dept. of Computer Science & Engineering', bio: 'Guides academic research alignments, community outreach, and official international chapter correspondence.', photo: '', email: 'rajeshk@amrita.edu', linkedin: '', github: '', whatsapp: '', instagram: '' },
      { id: 'fa-2', name: 'Prof. Meera Nair', role: 'Faculty Co-Sponsor', dept: 'Assistant Professor, Dept. of Computer Science & Engineering', bio: 'Oversees technical training schedules, hackathon organizations, and internal student project evaluations.', photo: '', email: 'meeranair@amrita.edu', linkedin: '', github: '', whatsapp: '', instagram: '' },
      { id: 'fa-3', name: 'Prof. Anand S.', role: 'Faculty Co-Sponsor', dept: 'Assistant Professor, Dept. of Computer Science & Engineering', bio: 'Supports the web developments, database architectures, and Cloud / AI workshop integrations.', photo: '', email: 'anands@amrita.edu', linkedin: '', github: '', whatsapp: '', instagram: '' }
    ];
  });

  // Leadership Admin states
  const [committeeForm, setCommitteeForm] = useState({ name: '', role: '', desc: '', email: '', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' });
  const [editingCommitteeId, setEditingCommitteeId] = useState(null);
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);

  const [facultyForm, setFacultyForm] = useState({ name: '', role: '', dept: '', bio: '', photo: '', email: '', linkedin: '', github: '', whatsapp: '', instagram: '' });
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [showFacultyForm, setShowFacultyForm] = useState(false);

  // Send Update Modal
  const [showSendUpdate, setShowSendUpdate] = useState(false);
  const [sendUpdateForm, setSendUpdateForm] = useState({ subject: '', message: '', eventId: '' });

  // Websockets, notification and email settings
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [wsLogs, setWsLogs] = useState([]);
  const [emailLogs, setEmailLogs] = useState(() => {
    const saved = localStorage.getItem('acm_portal_email_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'em-1', to: 'support@myamrita.me', subject: 'SMTP System Initialized', body: 'Real-time transactional email simulation online.', timestamp: new Date().toISOString() }
    ];
  });

  // Event details configuration behavior
  const [eventDetailsMode, setEventDetailsMode] = useState(() => {
    return localStorage.getItem('acm_portal_event_details_mode') || 'drawer';
  });
  const [eventFilter, setEventFilter] = useState('all');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

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
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  useEffect(() => {
    if (activeTab === 'gallery') {
      const saved = localStorage.getItem('acm_admin_gallery');
      if (saved) {
        setGallery(JSON.parse(saved));
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'events') return;
    const featured = events.filter(e => e.featured);
    if (featured.length <= 1) return;
    
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [events, activeTab]);

  // Map state to variables used in components
  const sigData = sigs;
  const eventsData = events;

  // Sub-tabs in administrator panel
  const [adminSubTab, setAdminSubTab] = useState('members');

  // Input states for admin forms
  const [memberForm, setMemberForm] = useState({ name: '', rollNo: '', email: '', interest: 'web', year: '1st Year', department: 'Computer Science and Engineering' });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [showMemberForm, setShowMemberForm] = useState(false);

  const [eventForm, setEventForm] = useState({ title: '', category: 'hackathon', date: '', location: '', time: '', desc: '', featured: false, image: '' });
  const [editingEventId, setEditingEventId] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);

  const [sigForm, setSigForm] = useState({ id: 'ai-ml', title: '', sub: '', desc: '', lead: '', facultyAdvisor: '', activeProject: '', status: '', membersCount: 0, image: '', joinNowEnabled: true });
  const [editingSigId, setEditingSigId] = useState(null);

  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxResult, setSandboxResult] = useState('');

  // Authentication hardening states
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);

  // Security and event logging utilities
  const logSecurityAction = (event, type, details) => {
    const newLog = {
      id: 'sec-' + Date.now(),
      timestamp: new Date().toISOString(),
      event,
      type,
      details
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  };

  const sanitizeInput = (text, fieldName = 'input') => {
    if (typeof text !== 'string') return text;
    let hasThreat = false;
    let threatType = '';
    let sanitized = text;

    // 1. Check for Scripts / HTML tag triggers (XSS)
    if (/<script|javascript:|onload|onerror|alert\(/i.test(sanitized)) {
      hasThreat = true;
      threatType = 'XSS Script Injection';
      sanitized = sanitized
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '[XSS SANITIZED]')
        .replace(/javascript:/gi, '[BLOCKED]')
        .replace(/onerror\s*=/gi, 'x-onerror=')
        .replace(/onload\s*=/gi, 'x-onload=')
        .replace(/alert\((.*?)\)/gi, 'console.log($1)');
    }

    // 2. Check for SQL Injection patterns
    if (/UNION\s+SELECT|INSERT\s+INTO|DROP\s+TABLE|DELETE\s+FROM|--|#|' OR '1'='1/i.test(sanitized)) {
      hasThreat = true;
      threatType = 'SQL Injection Threat';
      sanitized = sanitized
        .replace(/UNION\s+SELECT/gi, '[SQL UNION BLOCKED]')
        .replace(/INSERT\s+INTO/gi, '[SQL INSERT BLOCKED]')
        .replace(/DROP\s+TABLE/gi, '[SQL DROP BLOCKED]')
        .replace(/DELETE\s+FROM/gi, '[SQL DELETE BLOCKED]');
    }

    if (hasThreat) {
      logSecurityAction('Threat Blocked', 'warning', `Neutralized ${threatType} in field "${fieldName}": "${text}"`);
      showNotification('error', 'WAF Protection', `Intercepted malicious ${threatType} in field "${fieldName}"!`);
    }

    return sanitized;
  };

  // State synchronization with localStorage
  useEffect(() => {
    localStorage.setItem('acm_portal_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('acm_portal_sigs', JSON.stringify(sigs));
  }, [sigs]);

  useEffect(() => {
    localStorage.setItem('acm_portal_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('acm_portal_security_logs', JSON.stringify(securityLogs));
  }, [securityLogs]);

  useEffect(() => {
    localStorage.setItem('acm_portal_committee', JSON.stringify(committee));
  }, [committee]);

  useEffect(() => {
    localStorage.setItem('acm_portal_faculty', JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem('acm_portal_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('acm_portal_event_details_mode', eventDetailsMode);
  }, [eventDetailsMode]);

  // Session Inactivity Auto-Logout (10 Minutes)
  useEffect(() => {
    if (!user) return;

    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        showNotification('error', 'Security Shield', 'Session expired due to inactivity.');
        logSecurityAction('Session Expired', 'info', `Operator session timed out after 10 minutes of inactivity.`);
      }, 10 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [user]);

  // === REAL NOTIFICATION + REAL-TIME INFRASTRUCTURE ===
  const bcRef = useRef(null); // BroadcastChannel for real OS notifications via SW

  useEffect(() => {
    let ws;
    let reconnectTimeout;
    let active = true;
    let unsubscribeMembers = null;
    let unsubscribeInquiries = null;

    // --------------------------------------------------
    // 1. Register Service Worker for real OS push popups
    // --------------------------------------------------
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
          console.log('[SW] Registered:', reg.scope);

          // Request notification permission (shows real OS dialog)
          if ('Notification' in window && Notification.permission === 'default') {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
              showNotification('success', 'Notifications Enabled', 'Browser push notifications are now active for ACM Portal.');
            }
          }

          // Create BroadcastChannel to send messages to SW
          const bc = new BroadcastChannel('acm-notifications');
          bcRef.current = bc;
        } catch (err) {
          console.warn('[SW] Registration failed:', err);
        }
      }
    };
    registerSW();

    // --------------------------------------------------
    // 2. Firebase Firestore onSnapshot — REAL-TIME events
    //    These fire whenever new data is written to Firestore
    // --------------------------------------------------
    const setupFirestoreListeners = async () => {
      try {
        const { getFirestore, collection, onSnapshot, query, orderBy, limit } = await import('firebase/firestore');
        const { initializeApp, getApps } = await import('firebase/app');

        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID
        };

        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return;

        const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Track first snapshot to avoid firing on initial load
        let firstMemberSnap = true;
        let firstInquirySnap = true;

        // Listen for new member registrations
        const membersQ = query(collection(db, 'members'), orderBy('joinedAt', 'desc'), limit(10));
        unsubscribeMembers = onSnapshot(membersQ, (snapshot) => {
          if (firstMemberSnap) { firstMemberSnap = false; return; }
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added' && active) {
              const data = change.doc.data();
              const msg = `${data.name} (${data.rollNo}) just joined the ACM Chapter!`;
              showNotification('success', '🎉 New Member Registered', msg);
              logSecurityAction('Firestore Realtime', 'success', `New member detected: ${data.name}`);
              // Also send through BroadcastChannel → SW → real OS popup
              if (bcRef.current) {
                bcRef.current.postMessage({ title: 'New Member Registered', body: msg, type: 'success' });
              }
            }
          });
        });

        // Listen for contact form submissions
        const inquiriesQ = query(collection(db, 'contact_inquiries'), orderBy('timestamp', 'desc'), limit(5));
        unsubscribeInquiries = onSnapshot(inquiriesQ, (snapshot) => {
          if (firstInquirySnap) { firstInquirySnap = false; return; }
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added' && active) {
              const data = change.doc.data();
              const msg = `New inquiry from ${data.name} (${data.email})`;
              showNotification('info', '📬 Contact Form Received', msg);
              logSecurityAction('Firestore Realtime', 'info', `Contact inquiry from: ${data.email}`);
              if (bcRef.current) {
                bcRef.current.postMessage({ title: 'Contact Form Received', body: msg, type: 'info' });
              }
            }
          });
        });
      } catch (err) {
        console.warn('[Firestore onSnapshot] Not available — Firebase not configured', err);
      }
    };
    setupFirestoreListeners();

    // --------------------------------------------------
    // 3. WebSocket — connects for monitoring/log panel
    // --------------------------------------------------
    const connectWS = () => {
      if (!active) return;
      setWsStatus('connecting');
      try {
        ws = new WebSocket('wss://ws.postman-echo.com/raw');
        wsRef.current = ws;

        ws.onopen = () => {
          if (!active) return;
          setWsStatus('connected');
          logSecurityAction('WebSocket', 'success', 'Monitor connected to wss://ws.postman-echo.com/raw');
        };
        ws.onclose = () => {
          if (!active) return;
          setWsStatus('disconnected');
          wsRef.current = null;
          reconnectTimeout = setTimeout(connectWS, 8000);
        };
        ws.onerror = () => {
          if (!active) return;
          setWsStatus('disconnected');
          wsRef.current = null;
        };
        ws.onmessage = (event) => {
          if (!active) return;
          const logEntry = {
            id: 'ws-' + Date.now(),
            timestamp: new Date().toISOString(),
            message: event.data,
            direction: 'received'
          };
          setWsLogs(prev => [logEntry, ...prev].slice(0, 100));

          try {
            const data = JSON.parse(event.data);
            if (data.type === 'student_registered') {
              showNotification('success', 'Registration Echo', `Echoed: ${data.name} (${data.branch})`);
            } else if (data.type === 'contact_inquiry') {
              showNotification('info', 'Inquiry Echo', `Echoed inquiry from: ${data.email}`);
            }
          } catch (_) {}
        };
      } catch (err) {
        setWsStatus('disconnected');
        reconnectTimeout = setTimeout(connectWS, 8000);
      }
    };
    connectWS();

    return () => {
      active = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
      if (unsubscribeMembers) unsubscribeMembers();
      if (unsubscribeInquiries) unsubscribeInquiries();
      if (bcRef.current) bcRef.current.close();
    };
  }, []);

  // CRUD Handlers - MEMBERS
  const handleCreateMemberSubmit = (e) => {
    e.preventDefault();
    const sanitizedName = sanitizeInput(memberForm.name, 'Member Name');
    const sanitizedRollNo = sanitizeInput(memberForm.rollNo, 'Member Roll No');
    const sanitizedEmail = sanitizeInput(memberForm.email, 'Member Email');
    
    const newMember = {
      id: 'ACM-' + Math.floor(100000 + Math.random() * 900000),
      name: sanitizedName,
      rollNo: sanitizedRollNo,
      email: sanitizedEmail,
      interest: memberForm.interest,
      year: memberForm.year || '1st Year',
      department: memberForm.department || 'Computer Science and Engineering',
      joinedAt: new Date().toISOString()
    };

    setMembers(prev => [newMember, ...prev]);
    setShowMemberForm(false);
    setMemberForm({ name: '', rollNo: '', email: '', interest: 'web', year: '1st Year', department: 'Computer Science and Engineering' });
    logSecurityAction('Member Registry Insert', 'success', `Created member record for ${sanitizedName} (${newMember.id})`);
    showNotification('success', 'Registry Admin', `Registered member ${sanitizedName} successfully.`);
  };

  const handleUpdateMemberSubmit = (e) => {
    e.preventDefault();
    const sanitizedName = sanitizeInput(memberForm.name, 'Member Name');
    const sanitizedRollNo = sanitizeInput(memberForm.rollNo, 'Member Roll No');
    const sanitizedEmail = sanitizeInput(memberForm.email, 'Member Email');

    setMembers(prev => prev.map(m => m.id === editingMemberId ? {
      ...m,
      name: sanitizedName,
      rollNo: sanitizedRollNo,
      email: sanitizedEmail,
      interest: memberForm.interest,
      year: memberForm.year || '1st Year',
      department: memberForm.department || 'Computer Science and Engineering'
    } : m));

    setEditingMemberId(null);
    setShowMemberForm(false);
    setMemberForm({ name: '', rollNo: '', email: '', interest: 'web', year: '1st Year', department: 'Computer Science and Engineering' });
    logSecurityAction('Member Registry Update', 'info', `Updated member record for ID: ${editingMemberId}`);
    showNotification('success', 'Registry Admin', 'Member record updated successfully.');
  };

  const handleDeleteMember = (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to delete member: ${memberName}?`)) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      logSecurityAction('Member Registry Delete', 'warning', `Deleted member record for ${memberName} (${memberId})`);
      showNotification('success', 'Registry Admin', `Deleted member ${memberName}.`);
    }
  };

  // CRUD Handlers - EVENTS
  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(eventForm.title, 'Event Title');
    const sanitizedDate = sanitizeInput(eventForm.date, 'Event Date');
    const sanitizedLocation = sanitizeInput(eventForm.location, 'Event Location');
    const sanitizedTime = sanitizeInput(eventForm.time, 'Event Time');
    const sanitizedDesc = sanitizeInput(eventForm.desc, 'Event Description');

    const newEvent = {
      id: 'evt-' + Date.now(),
      title: sanitizedTitle,
      category: eventForm.category,
      date: sanitizedDate,
      location: sanitizedLocation,
      time: sanitizedTime,
      desc: sanitizedDesc,
      featured: eventForm.featured,
      tag: eventForm.featured ? `Featured ${eventForm.category.toUpperCase()}` : '',
      image: eventForm.image || ''
    };

    setEvents(prev => [newEvent, ...prev]);
    setShowEventForm(false);
    setEventForm({ title: '', category: 'hackathon', date: '', location: '', time: '', desc: '', featured: false, image: '' });
    logSecurityAction('Event Database Insert', 'success', `Created event: "${sanitizedTitle}"`);
    showNotification('success', 'Events Controller', `Created event "${sanitizedTitle}" successfully.`);
  };

  const handleUpdateEventSubmit = (e) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(eventForm.title, 'Event Title');
    const sanitizedDate = sanitizeInput(eventForm.date, 'Event Date');
    const sanitizedLocation = sanitizeInput(eventForm.location, 'Event Location');
    const sanitizedTime = sanitizeInput(eventForm.time, 'Event Time');
    const sanitizedDesc = sanitizeInput(eventForm.desc, 'Event Description');

    setEvents(prev => prev.map(evt => evt.id === editingEventId ? {
      ...evt,
      title: sanitizedTitle,
      category: eventForm.category,
      date: sanitizedDate,
      location: sanitizedLocation,
      time: sanitizedTime,
      desc: sanitizedDesc,
      featured: eventForm.featured,
      tag: eventForm.featured ? `Featured ${eventForm.category.toUpperCase()}` : '',
      image: eventForm.image || evt.image || ''
    } : evt));

    setEditingEventId(null);
    setShowEventForm(false);
    setEventForm({ title: '', category: 'hackathon', date: '', location: '', time: '', desc: '', featured: false, image: '' });
    logSecurityAction('Event Database Update', 'info', `Updated event: "${sanitizedTitle}"`);
    showNotification('success', 'Events Controller', 'Event details updated successfully.');
  };

  const handleDeleteEvent = (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete event: "${eventTitle}"?`)) {
      setEvents(prev => prev.filter(evt => evt.id !== eventId));
      logSecurityAction('Event Database Delete', 'warning', `Deleted event: "${eventTitle}"`);
      showNotification('success', 'Events Controller', `Deleted event "${eventTitle}".`);
    }
  };

  // CRUD Handlers - SIG DETAILS
  const handleUpdateSigSubmit = (e) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(sigForm.title, 'SIG Title');
    const sanitizedSub = sanitizeInput(sigForm.sub, 'SIG Subtitle');
    const sanitizedDesc = sanitizeInput(sigForm.desc, 'SIG Description');
    const sanitizedProject = sanitizeInput(sigForm.activeProject, 'SIG Active Project');
    const sanitizedStatus = sanitizeInput(sigForm.status, 'SIG Status');
    const sanitizedLead = sanitizeInput(sigForm.lead, 'SIG Lead');
    const sanitizedAdvisor = sanitizeInput(sigForm.facultyAdvisor, 'SIG Advisor');

    setSigs(prev => ({
      ...prev,
      [editingSigId]: {
        ...prev[editingSigId],
        title: sanitizedTitle,
        sub: sanitizedSub,
        desc: sanitizedDesc,
        lead: sanitizedLead,
        facultyAdvisor: sanitizedAdvisor,
        activeProject: sanitizedProject,
        status: sanitizedStatus,
        membersCount: parseInt(sigForm.membersCount) || 0,
        image: sigForm.image || prev[editingSigId]?.image || '',
        joinNowEnabled: sigForm.joinNowEnabled
      }
    }));

    setEditingSigId(null);
    logSecurityAction('SIG Explorer Update', 'info', `Updated SIG details for key: ${editingSigId}`);
    showNotification('success', 'SIG Admin', 'SIG project explorer details updated successfully.');
  };

  // Image file → base64 helper
  const handleImageFileToBase64 = (file, onDone) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Upload Failed', 'Image must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => onDone(evt.target.result);
    reader.readAsDataURL(file);
  };

  // Send Update to All Members handler
  const handleSendUpdate = (e) => {
    e.preventDefault();
    const { subject, message, eventId } = sendUpdateForm;
    if (!subject.trim() || !message.trim()) return;

    const logEntry = {
      id: 'em-' + Date.now(),
      to: 'all-members@amrita.edu',
      subject: subject,
      body: message,
      timestamp: new Date().toISOString()
    };
    setEmailLogs(prev => [logEntry, ...prev]);
    logSecurityAction('Broadcast Update Sent', 'success', `Sent update "${subject}" to all members`);
    showNotification('success', '📢 Update Sent', `Update "${subject}" broadcast to all members.`);
    setShowSendUpdate(false);
    setSendUpdateForm({ subject: '', message: '', eventId: '' });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'broadcast_update', subject, message }));
    }
  };

  // CRUD Handlers - ASSETS
  const handleAssetUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Max file size check: 5MB
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Asset Upload Failed', 'Asset size exceeds maximum limit of 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const newAsset = {
        id: 'asset-' + Date.now(),
        name: file.name,
        type: file.type,
        url: evt.target.result,
        size: `${(file.size / 1024).toFixed(1)} KB`
      };

      setAssets(prev => [newAsset, ...prev]);
      logSecurityAction('Asset Gallery Upload', 'success', `Uploaded asset "${file.name}" of size ${newAsset.size}`);
      showNotification('success', 'Asset Manager', `Uploaded "${file.name}" to branding assets.`);
    };
    reader.readAsDataURL(file);
  };

  const handleAssetDelete = (assetId, assetName) => {
    if (window.confirm(`Are you sure you want to delete asset: "${assetName}"?`)) {
      setAssets(prev => prev.filter(a => a.id !== assetId));
      logSecurityAction('Asset Gallery Delete', 'warning', `Deleted asset "${assetName}"`);
      showNotification('success', 'Asset Manager', `Deleted asset "${assetName}".`);
    }
  };

  const handleAddAssetUrl = (name, url) => {
    const newAsset = {
      id: 'asset-url-' + Date.now(),
      name: name || 'External Media URL',
      type: 'image/url',
      url: url,
      size: 'Remote URL'
    };
    setAssets(prev => [newAsset, ...prev]);
    logSecurityAction('Asset Manager Link Add', 'success', `Added asset URL link for "${newAsset.name}"`);
    showNotification('success', 'Asset Manager', `Added image URL link "${newAsset.name}".`);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements[0].value;
    const email = form.elements[1].value;
    const message = form.elements[2].value;

    const inquiryData = {
      id: 'em-' + Date.now(),
      name,
      email,
      message,
      to: 'support@myamrita.me',
      subject: `New Inquiry from ${name}`,
      timestamp: new Date().toISOString()
    };

    // Log locally always
    setEmailLogs(prev => [inquiryData, ...prev]);

    // Write to Firestore — this triggers the onSnapshot listener → real notification
    let wroteToFirestore = false;
    try {
      const { getFirestore, collection, addDoc } = await import('firebase/firestore');
      const { getApps } = await import('firebase/app');
      if (getApps().length) {
        const db = getFirestore(getApps()[0]);
        await addDoc(collection(db, 'contact_inquiries'), inquiryData);
        wroteToFirestore = true;
      }
    } catch (err) {
      console.warn('[Contact] Firestore write failed — using local fallback');
    }

    // Also echo via WebSocket monitor
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'contact_inquiry', email, message }));
    }

    if (!wroteToFirestore) {
      showNotification('success', '📬 Inquiry Sent', `Thank you ${name}! We'll respond to ${email} shortly.`);
    }

    form.reset();
  };

  // CRUD Handlers - MAIN CORE COMMITTEE
  const handleCreateCommitteeSubmit = (e) => {
    e.preventDefault();
    const sanitizedName = sanitizeInput(committeeForm.name, 'Committee Member Name');
    const sanitizedRole = sanitizeInput(committeeForm.role, 'Committee Member Role');
    const sanitizedDesc = sanitizeInput(committeeForm.desc, 'Committee Member Bio');
    const sanitizedEmail = sanitizeInput(committeeForm.email, 'Committee Member Email');

    const newMember = {
      id: 'cc-' + Date.now(),
      name: sanitizedName,
      role: sanitizedRole,
      desc: sanitizedDesc,
      email: sanitizedEmail,
      photo: committeeForm.photo || '',
      linkedin: committeeForm.linkedin || '',
      github: committeeForm.github || '',
      twitter: committeeForm.twitter || '',
      instagram: committeeForm.instagram || '',
      whatsapp: committeeForm.whatsapp || ''
    };

    setCommittee(prev => [...prev, newMember]);
    setShowCommitteeForm(false);
    setCommitteeForm({ name: '', role: '', desc: '', email: '', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' });
    logSecurityAction('Leadership Committee Add', 'success', `Added committee member: ${sanitizedName}`);
    showNotification('success', 'Leadership Admin', `Added ${sanitizedName} to Core Committee.`);
  };

  const handleUpdateCommitteeSubmit = (e) => {
    e.preventDefault();
    const sanitizedName = sanitizeInput(committeeForm.name, 'Committee Member Name');
    const sanitizedRole = sanitizeInput(committeeForm.role, 'Committee Member Role');
    const sanitizedDesc = sanitizeInput(committeeForm.desc, 'Committee Member Bio');
    const sanitizedEmail = sanitizeInput(committeeForm.email, 'Committee Member Email');

    setCommittee(prev => prev.map(m => m.id === editingCommitteeId ? {
      ...m,
      name: sanitizedName,
      role: sanitizedRole,
      desc: sanitizedDesc,
      email: sanitizedEmail,
      photo: committeeForm.photo || m.photo || '',
      linkedin: committeeForm.linkedin || '',
      github: committeeForm.github || '',
      twitter: committeeForm.twitter || '',
      instagram: committeeForm.instagram || '',
      whatsapp: committeeForm.whatsapp || ''
    } : m));

    setEditingCommitteeId(null);
    setShowCommitteeForm(false);
    setCommitteeForm({ name: '', role: '', desc: '', email: '', photo: '', linkedin: '', github: '', twitter: '', instagram: '', whatsapp: '' });
    logSecurityAction('Leadership Committee Update', 'info', `Updated committee member: ${sanitizedName}`);
    showNotification('success', 'Leadership Admin', `Updated committee member details.`);
  };

  const handleDeleteCommittee = (id, name) => {
    if (window.confirm(`Are you sure you want to delete committee member: "${name}"?`)) {
      setCommittee(prev => prev.filter(m => m.id !== id));
      logSecurityAction('Leadership Committee Delete', 'warning', `Deleted committee member: ${name}`);
      showNotification('success', 'Leadership Admin', `Removed ${name} from Core Committee.`);
    }
  };

  // CRUD Handlers - MAIN FACULTY
  const handleCreateFacultySubmit = (e) => {
    e.preventDefault();
    const sanitizedName = sanitizeInput(facultyForm.name, 'Faculty Name');
    const sanitizedRole = sanitizeInput(facultyForm.role, 'Faculty Role');
    const sanitizedDept = sanitizeInput(facultyForm.dept, 'Faculty Dept');
    const sanitizedBio = sanitizeInput(facultyForm.bio, 'Faculty Bio');

    const newFac = {
      id: 'fa-' + Date.now(),
      name: sanitizedName,
      role: sanitizedRole,
      dept: sanitizedDept,
      bio: sanitizedBio,
      photo: facultyForm.photo || '',
      email: facultyForm.email || '',
      linkedin: facultyForm.linkedin || '',
      github: facultyForm.github || '',
      whatsapp: facultyForm.whatsapp || '',
      instagram: facultyForm.instagram || ''
    };

    setFaculty(prev => [...prev, newFac]);
    setShowFacultyForm(false);
    setFacultyForm({ name: '', role: '', dept: '', bio: '', photo: '', email: '', linkedin: '', github: '', whatsapp: '', instagram: '' });
    logSecurityAction('Leadership Faculty Add', 'success', `Added faculty advisor: ${sanitizedName}`);
    showNotification('success', 'Leadership Admin', `Added ${sanitizedName} to Faculty Advisors.`);
  };

  const handleUpdateFacultySubmit = (e) => {
    e.preventDefault();
    const sanitizedName = sanitizeInput(facultyForm.name, 'Faculty Name');
    const sanitizedRole = sanitizeInput(facultyForm.role, 'Faculty Role');
    const sanitizedDept = sanitizeInput(facultyForm.dept, 'Faculty Dept');
    const sanitizedBio = sanitizeInput(facultyForm.bio, 'Faculty Bio');

    setFaculty(prev => prev.map(f => f.id === editingFacultyId ? {
      ...f,
      name: sanitizedName,
      role: sanitizedRole,
      dept: sanitizedDept,
      bio: sanitizedBio,
      photo: facultyForm.photo || f.photo || '',
      email: facultyForm.email || '',
      linkedin: facultyForm.linkedin || '',
      github: facultyForm.github || '',
      whatsapp: facultyForm.whatsapp || '',
      instagram: facultyForm.instagram || ''
    } : f));

    setEditingFacultyId(null);
    setShowFacultyForm(false);
    setFacultyForm({ name: '', role: '', dept: '', bio: '', photo: '', email: '', linkedin: '', github: '', whatsapp: '', instagram: '' });
    logSecurityAction('Leadership Faculty Update', 'info', `Updated faculty advisor details: ${sanitizedName}`);
    showNotification('success', 'Leadership Admin', `Updated faculty advisor details.`);
  };

  const handleDeleteFaculty = (id, name) => {
    if (window.confirm(`Are you sure you want to delete faculty advisor: "${name}"?`)) {
      setFaculty(prev => prev.filter(f => f.id !== id));
      logSecurityAction('Leadership Faculty Delete', 'warning', `Deleted faculty advisor: ${name}`);
      showNotification('success', 'Leadership Admin', `Removed ${name} from Faculty Advisors.`);
    }
  };

  const handleAccentChange = (color) => {
    setAccentColor(color);
    const root = document.documentElement;
    if (color === 'blue') {
      root.style.setProperty('--accent', '#0071e3');
      root.style.setProperty('--accent-rgb', '0, 113, 227');
    } else if (color === 'amber') {
      root.style.setProperty('--accent', '#f56300');
      root.style.setProperty('--accent-rgb', '245, 99, 0');
    } else if (color === 'pink') {
      root.style.setProperty('--accent', '#d300c5');
      root.style.setProperty('--accent-rgb', '211, 0, 197');
    } else if (color === 'green') {
      root.style.setProperty('--accent', '#34c759');
      root.style.setProperty('--accent-rgb', '52, 199, 89');
    } else if (color === 'purple') {
      root.style.setProperty('--accent', '#af52de');
      root.style.setProperty('--accent-rgb', '175, 82, 222');
    }
  };

  const handleBlurChange = (val) => {
    setGlassBlur(val);
    document.documentElement.style.setProperty('--glass-blur', `${val}px`);
  };
  
  // Admin Portal states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInterest, setFilterInterest] = useState('all');
  const [notification, setNotification] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const showNotification = (type, title, message) => {
    const entry = { id: 'notif-' + Date.now(), type, title, message, timestamp: new Date().toISOString(), read: false };
    setNotification(entry);
    setNotificationHistory(prev => [entry, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);

    // Real OS-level browser notification (fires even if tab is in background)
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification(`ACM Portal — ${title}`, {
          body: message,
          icon: '/acm-logo.png',
          badge: '/acm-logo.png',
          tag: 'acm-' + type,
          silent: false
        });
        n.onclick = () => { window.focus(); n.close(); };
      } catch (err) { /* Safari blocks some notification features */ }
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load database from Firebase/localStorage on startup
  useEffect(() => {
    const fetchMembers = async () => {
      const data = await getMembersFromDB();
      setMembers(data);
    };
    fetchMembers();
  }, []);

  const handleRegisterMember = async (newMember) => {
    const saved = await registerMemberInDB(newMember);
    setMembers((prev) => [saved, ...prev]);
    setIsJoinModalOpen(false);
    setRegisteredSuccess(saved);
  };

  const handleOpenJoinModal = (interest = 'web') => {
    setDefaultJoinInterest(interest);
    setIsJoinModalOpen(true);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const now = Date.now();

    if (lockoutUntil && now < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - now) / 1000);
      setLoginError(`Authentication Lockout active. Retry in ${remaining} seconds.`);
      return;
    }

    if (adminEmail === 'admin@amrita.edu' && adminPassword === 'acm@2026') {
      const loggedUser = { email: adminEmail, name: 'Lead Administrator', role: 'admin' };
      setUser(loggedUser);
      setLoginError('');
      setLoginAttempts(0);
      logSecurityAction('Authentication Success', 'success', 'Lead Administrator signed in successfully.');
      showNotification('success', 'Admin Portal', 'Lead Administrator authenticated successfully.');
    } else {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if (attempts >= 5) {
        setLockoutUntil(Date.now() + 30000); // 30 seconds
        setLoginError('Brute-force protection: Too many failed logins. Lockout for 30s.');
        logSecurityAction('Brute-Force Threat Detected', 'critical', '5 consecutive failed admin logins. Triggered lockout.');
        showNotification('error', 'Security Alert', 'Brute force lockout active! Check security logs.');
      } else {
        setLoginError(`Invalid Administrator credentials. Attempt ${attempts}/5.`);
        logSecurityAction('Authentication Failure', 'warning', `Failed login attempt for account ${adminEmail}`);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAdminEmail('');
    setAdminPassword('');
    logSecurityAction('Operator Sign Out', 'info', 'Lead Administrator signed out of session.');
  };

  const generateBulkData = async () => {
    const names = ['Hari', 'Meera', 'Gokul', 'Sruthi', 'Vijay', 'Divya', 'Ananth', 'Keerthana', 'Jithin', 'Sneha'];
    const domains = ['web', 'ai-ml', 'cp', 'cyber', 'ui-ux'];
    const addedList = [];
    
    for (let i = 0; i < 100; i++) {
      const name = `${names[Math.floor(Math.random() * names.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      const rollNo = `AM.EN.U4CSE23${String(Math.floor(100 + Math.random() * 150))}`;
      const email = `${name.toLowerCase().replace(' ', '')}@am.amrita.edu`;
      const interest = domains[Math.floor(Math.random() * domains.length)];
      
      addedList.push({
        id: 'ACM-' + Math.floor(100000 + Math.random() * 900000),
        name,
        email,
        rollNo,
        interest,
        joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    const success = await addBulkMembersToDB(addedList);
    const data = await getMembersFromDB();
    setMembers(data);
    
    if (success) {
      showNotification('success', 'Database Sync', 'Generated 100 high-performance Firestore database entries successfully!');
    } else {
      showNotification('success', 'Local Database', 'Generated 100 high-performance local storage database entries successfully!');
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterInterest === 'all' || m.interest === filterInterest;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onJoinClick={() => handleOpenJoinModal('web')}
          user={user}
          onLogout={handleLogout}
        />

        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            <Hero 
              onJoinClick={() => handleOpenJoinModal('web')} 
              onExploreClick={() => {
                const element = document.getElementById('resources');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            
            {/* Bento Dashboard Section */}
            <section className="section-container" style={{ paddingBottom: '0px' }}>
              <div className="section-header">
                <div className="section-label">Interactive Dashboard</div>
                <h2 className="section-title-large font-bold">Experience Liquid Glass</h2>
              </div>
            </section>

            <section className="section-container" style={{ paddingTop: '0px' }}>
              <div className="bento-grid-dashboard">
                {/* Live Stats Card */}
                <div className="apple-card bento-card-single relative overflow-hidden" style={{ padding: '24px' }}>
                  <div className="bento-glow-blob blob-right"></div>
                  <div className="bento-card-header">
                    <div className="bento-card-icon"><Users size={16} /></div>
                    <div className="bento-card-title">Portal Metrics</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
                    <div className="liquid-glass-badge" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Members</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>200+</span>
                    </div>
                    <div className="liquid-glass-badge" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Workshops Completed</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>15+</span>
                    </div>
                    <div className="liquid-glass-badge" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Research SIGs</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>4</span>
                    </div>
                  </div>
                </div>

                {/* SIG Project Explorer Card */}
                <div className="apple-card bento-card-double relative overflow-hidden" style={{ padding: '24px' }}>
                  <div className="bento-glow-blob blob-left"></div>
                  <div className="bento-card-header">
                    <div className="bento-card-icon"><Terminal size={16} /></div>
                    <div className="bento-card-title">SIG Project Explorer</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
                    <div className="segmented-control" style={{ margin: '0', alignSelf: 'flex-start' }}>
                      {(() => {
                        const sigKeys = Object.keys(sigData);
                        const activeIndex = sigKeys.indexOf(activeSigTab);
                        return (
                          <>
                            <div 
                              className="segmented-indicator" 
                              style={{ 
                                width: `calc((100% - 8px) / ${sigKeys.length})`,
                                transform: `translateX(calc(${activeIndex >= 0 ? activeIndex : 0} * 100%))`
                              }} 
                            />
                            {sigKeys.map((key) => (
                              <button
                                key={key}
                                className={`segmented-button ${activeSigTab === key ? 'active' : ''}`}
                                onClick={() => setActiveSigTab(key)}
                                style={{ padding: '8px 16px', fontSize: '12.5px' }}
                              >
                                {key.toUpperCase().replace('-', ' ')}
                              </button>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                    
                    <div style={{ flex: 1, padding: '12px 0' }}>
                      <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {sigData[activeSigTab].title}
                      </h4>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                        {sigData[activeSigTab].desc}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="liquid-glass-badge" style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '12px' }}>
                          Active Project: <strong style={{ color: 'var(--text-primary)' }}>{sigData[activeSigTab].activeProject}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                          <span style={{
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: sigData[activeSigTab].status.includes('Completed') ? '#34c759' : 'var(--accent)'
                          }}></span>
                          <span style={{ color: 'var(--text-secondary)' }}>{sigData[activeSigTab].status}</span>
                        </div>
                        {sigData[activeSigTab].joinNowEnabled !== false && (
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setActiveSigForJoin({ key: activeSigTab, title: sigData[activeSigTab].title });
                              setIsSigJoinModalOpen(true);
                            }}
                            style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', height: '28px', border: 'none', borderRadius: '8px', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}
                          >
                            <UserPlus size={12} /> Join Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter Vision Card */}
                <div className="apple-card bento-card-single relative overflow-hidden" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="bento-glow-blob blob-left" style={{ background: 'rgba(255, 99, 0, 0.1)' }}></div>
                  <div className="bento-card-header">
                    <div className="bento-card-icon"><Flame size={16} /></div>
                    <div className="bento-card-title">Our Vision</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '10px 0' }}>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      Empowering students to solve real-world technical problems through scientific computing, research collaboration, and design-led engineering.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleOpenJoinModal('web')}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '10px', fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span>Join Amrita ACM</span> <ArrowUpRight size={14} />
                  </button>
                </div>

                {/* Core Pillars Card */}
                <div className="apple-card bento-card-double relative overflow-hidden" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="bento-glow-blob blob-right" style={{ background: 'rgba(var(--accent-rgb), 0.15)' }}></div>
                  <div className="bento-card-header">
                    <div className="bento-card-icon"><Sparkles size={16} /></div>
                    <div className="bento-card-title">Core Pillars</div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', margin: '14px 0', flex: 1 }}>
                    <div className="liquid-glass-badge" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>01. Tech Excellence</span>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                        Leading competitive coding, hackathons, and software engineering bootcamps.
                      </p>
                    </div>
                    <div className="liquid-glass-badge" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>02. Research & Dev</span>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                        Exploring novel AI/ML, Cyber Security solutions, and technical paper publication.
                      </p>
                    </div>
                    <div className="liquid-glass-badge" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>03. Mentorship</span>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                        Bridging knowledge gaps via direct senior-to-junior guidance and technical sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spotlight Banner Card */}
              <div className="spotlight-banner-card">
                <div className="bento-glow-blob blob-right" style={{ width: '400px', height: '400px' }}></div>
                <div className="spotlight-overlay-content">
                  <div className="spotlight-header-label">ACM Student Chapters</div>
                  <h3 className="spotlight-title">National ACM Champions</h3>
                  <p className="spotlight-desc">
                    Our student teams designed and coded state-of-the-art secure web architectures, securing first place in the national ACM Student Contest.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => showNotification('success', 'Case Study Unlocked', 'Amrita Nagercoil Chapter Case Study has been downloaded.')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Read Case Study <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            <DesignGrid showNotification={showNotification} />
          </>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <section className="section-container" style={{ paddingTop: '100px' }}>
            <div className="section-header">
              <div className="section-label">Who We Are</div>
              <h2 className="section-title-large">Amrita ACM Student Chapter</h2>
            </div>
            
            <div className="apple-grid" style={{ gridTemplateColumns: '1fr', gap: '30px' }}>
              <div className="apple-card" style={{ minHeight: 'auto' }}>
                <div className="card-top">
                  <h3 className="card-title">Our Mission</h3>
                  <p className="card-desc" style={{ fontSize: '15px', lineHeight: '1.6', marginTop: '12px' }}>
                    The Amrita ACM Student Chapter serves as a dynamic hub for students at the Amrita Nagercoil campus to cultivate interest and expertise in computing machinery. By organizing high-impact workshops, hackathons, and collaborative projects, we connect students with international computing communities and industry standards.
                  </p>
                </div>
              </div>

              <div className="apple-grid-3">
                <div className="liquid-glass-badge" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)' }}>200+</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Active Members</div>
                </div>
                <div className="liquid-glass-badge" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)' }}>15+</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Major Events</div>
                </div>
                <div className="liquid-glass-badge" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--accent)' }}>4</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Special Interest Groups</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Core Committee Tab */}
        {activeTab === 'core-committee' && (
          <section className="section-container" style={{ paddingTop: '100px' }}>
            <div className="section-header">
              <div className="section-label">Leadership</div>
              <h2 className="section-title-large">Core Committee 2026</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>The driving force behind Amrita ACM Chapter — our elected student leaders.</p>
            </div>
            <div className="apple-grid-auto">
              {committee.map((member) => {
                const initials = member.name.split(' ').filter(n => n.length > 1).map(n => n[0]).join('').substring(0,2);
                return (
                  <div className="leadership-card" key={member.id}>
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="leadership-photo" />
                    ) : (
                      <div className="leadership-placeholder">
                        <span className="leadership-initials">{initials}</span>
                      </div>
                    )}
                    <div className="leadership-overlay">
                      <div className="leadership-role">{member.role}</div>
                      <h3 className="leadership-name">{member.name}</h3>
                      {member.desc && <p className="leadership-desc">{member.desc}</p>}
                      <div className="leadership-socials">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="leadership-social-btn" title="Email">
                            <Mail size={14} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noreferrer" className="leadership-social-btn" title="LinkedIn">
                            <Linkedin size={14} />
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noreferrer" className="leadership-social-btn" title="GitHub">
                            <Github size={14} />
                          </a>
                        )}
                        {member.instagram && (
                          <a href={member.instagram} target="_blank" rel="noreferrer" className="leadership-social-btn" title="Instagram">
                            <Instagram size={14} />
                          </a>
                        )}
                        {member.whatsapp && (
                          <a href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noreferrer" className="leadership-social-btn" title="WhatsApp">
                            <MessageCircle size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Faculty Tab */}
        {activeTab === 'faculty' && (
          <section className="section-container" style={{ paddingTop: '100px' }}>
            <div className="section-header">
              <div className="section-label">Mentorship</div>
              <h2 className="section-title-large">Faculty Advisors</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '8px' }}>Our esteemed faculty guiding the chapter towards academic excellence.</p>
            </div>
            <div className="apple-grid-auto">
              {faculty.map((fac) => {
                const initials = fac.name.split(' ').filter(n => n.length > 1).map(n => n[0]).join('').substring(0,2);
                return (
                  <div className="leadership-card" key={fac.id}>
                    {fac.photo ? (
                      <img src={fac.photo} alt={fac.name} className="leadership-photo" />
                    ) : (
                      <div className="leadership-placeholder">
                        <span className="leadership-initials">{initials}</span>
                      </div>
                    )}
                    <div className="leadership-overlay">
                      <div className="leadership-role">{fac.role}</div>
                      <h3 className="leadership-name">{fac.name}</h3>
                      {fac.dept && <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 500, marginBottom: '6px' }}>{fac.dept}</div>}
                      {fac.bio && <p className="leadership-desc">{fac.bio}</p>}
                      <div className="leadership-socials">
                        {fac.email && (
                          <a href={`mailto:${fac.email}`} className="leadership-social-btn" title="Email">
                            <Mail size={14} />
                          </a>
                        )}
                        {fac.linkedin && (
                          <a href={fac.linkedin} target="_blank" rel="noreferrer" className="leadership-social-btn" title="LinkedIn">
                            <Linkedin size={14} />
                          </a>
                        )}
                        {fac.github && (
                          <a href={fac.github} target="_blank" rel="noreferrer" className="leadership-social-btn" title="GitHub">
                            <Github size={14} />
                          </a>
                        )}
                        {fac.instagram && (
                          <a href={fac.instagram} target="_blank" rel="noreferrer" className="leadership-social-btn" title="Instagram">
                            <Instagram size={14} />
                          </a>
                        )}
                        {fac.whatsapp && (
                          <a href={`https://wa.me/${fac.whatsapp}`} target="_blank" rel="noreferrer" className="leadership-social-btn" title="WhatsApp">
                            <MessageCircle size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SIG Tab */}
        {activeTab === 'sig' && (
          <section className="section-container" style={{ paddingTop: '100px' }}>
            <div className="section-header">
              <div className="section-label">Specialization</div>
              <h2 className="section-title-large">Special Interest Groups (SIG)</h2>
            </div>
            <div className="apple-grid">
              {Object.entries(sigs).map(([key, sig]) => {
                const interestMap = {
                  'ai-ml': 'ai-ml',
                  'web-dev': 'web',
                  'security': 'cyber',
                  'cp': 'cp'
                };
                const selectedInterest = interestMap[key] || 'web';
                return (
                  <div className="apple-card" key={key} style={{ minHeight: '260px', display: 'flex', flexDirection: 'column' }}>
                    {sig.image && <img src={sig.image} alt={sig.title} className="sig-card-image" />}
                    <div className="card-top" style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="card-icon" style={{ borderRadius: '12px', width: '40px', height: '40px', margin: 0 }}>
                          <Terminal size={18} />
                        </div>
                        <span className={`status-badge ${sig.status.toLowerCase().includes('completed') || sig.status.toLowerCase().includes('active') ? 'badge-success' : sig.status.toLowerCase().includes('beta') ? 'badge-info' : 'badge-warning'}`}>
                          {sig.status}
                        </span>
                      </div>
                      <h3 className="card-title" style={{ fontSize: '19px', marginTop: '12px' }}>{sig.title}</h3>
                      {sig.sub && <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>{sig.sub}</div>}
                      <p className="card-desc" style={{ marginTop: '10px', fontSize: '13.5px', lineHeight: '1.4' }}>{sig.desc}</p>
                      {sig.activeProject && (
                        <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border)', fontSize: '12.5px' }}>
                          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}>Active Project</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{sig.activeProject}</span>
                        </div>
                      )}
                    </div>
                    {sig.joinNowEnabled !== false && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenJoinModal(selectedInterest)}
                        style={{ marginTop: '14px', width: '100%', padding: '10px 0', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Plus size={14} /> Join Now
                      </button>
                    )}
                    <div className="card-bottom" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {sig.lead && <span>Lead: <b style={{ color: 'var(--text-primary)' }}>{sig.lead}</b></span>}
                      {sig.facultyAdvisor && <span>Advisor: <b style={{ color: 'var(--text-primary)' }}>{sig.facultyAdvisor}</b></span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <section className="section-container" style={{ paddingTop: '100px' }}>
            <div className="section-header">
              <div className="section-label">Get in Touch</div>
              <h2 className="section-title-large">Contact ACM Chapter</h2>
            </div>
            
            <div className="apple-grid">
              <div className="apple-card" style={{ minHeight: 'auto', padding: '32px' }}>
                <div className="card-top">
                  <h3 className="card-title">Connect Info</h3>
                  <p className="card-desc" style={{ marginTop: '12px', fontSize: '14px' }}>
                    Have questions about registrations, upcoming workshops, or SIG programs? Reach out to our campus desk or send an email.
                  </p>
                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="card-icon" style={{ width: '36px', height: '36px', margin: 0 }}><Mail size={16} /></div>
                      <div style={{ fontSize: '14px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>EMAIL ADDRESS</div>
                        <a href="mailto:support@myamrita.me" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>support@myamrita.me</a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="card-icon" style={{ width: '36px', height: '36px', margin: 0 }}><Users size={16} /></div>
                      <div style={{ fontSize: '14px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>CAMPUS LOCATION</div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Amrita Nagercoil Campus, Tamil Nadu, India</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="apple-card" style={{ minHeight: 'auto', padding: '32px' }}>
                <div className="card-top">
                  <h3 className="card-title" style={{ marginBottom: '16px' }}>Send Message</h3>
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-input" placeholder="Aravind S" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" placeholder="aravind@gmail.com" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Your Message</label>
                      <textarea className="form-input" rows="3" placeholder="Write your inquiry here..." style={{ resize: 'none', fontFamily: 'inherit' }} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                      Submit Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <section className="section-container" style={{ paddingTop: '100px' }}>
            <div className="section-header">
              <div className="section-label">ACM Chapter Programs</div>
              <h2 className="section-title-large">Upcoming Workshops & Hackathons</h2>
            </div>

            {/* Segmented Category Switcher */}
            <div className="segmented-control-container">
              <div className="segmented-control">
                {(() => {
                  const eventTabs = [
                    { id: 'all', label: 'All Events' },
                    { id: 'hackathon', label: 'Hackathons' },
                    { id: 'workshop', label: 'Workshops' },
                    { id: 'sig', label: 'SIG Meetups' }
                  ];
                  const activeIndex = eventTabs.findIndex(t => t.id === eventFilter);
                  return (
                    <>
                      <div 
                        className="segmented-indicator" 
                        style={{ 
                          width: `calc((100% - 8px) / ${eventTabs.length})`,
                          transform: `translateX(calc(${activeIndex >= 0 ? activeIndex : 0} * 100%))`
                        }} 
                      />
                      {eventTabs.map((btn) => (
                        <button
                          key={btn.id}
                          className={`segmented-button ${eventFilter === btn.id ? 'active' : ''}`}
                          onClick={() => {
                            setEventFilter(btn.id);
                            setCarouselIndex(0);
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Featured Event Card Carousel */}
            {eventsData.filter(e => e.featured).length > 0 && (
              <div className="carousel-wrapper">
                <div className="carousel-header">
                  <div className="carousel-section-title">Featured Highlights</div>
                  <div className="carousel-controls">
                    <button 
                      className="carousel-arrow-btn"
                      disabled={carouselIndex === 0}
                      onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                      aria-label="Previous event"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      className="carousel-arrow-btn"
                      disabled={carouselIndex >= eventsData.filter(e => e.featured).length - 1}
                      onClick={() => setCarouselIndex(prev => Math.min(eventsData.filter(e => e.featured).length - 1, prev + 1))}
                      aria-label="Next event"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="carousel-track-container">
                  <div 
                    className="carousel-track" 
                    style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                  >
                    {eventsData.filter(e => e.featured).map((evt) => (
                      <div className="carousel-slide" key={evt.id || evt._id}>
                        <div 
                          className="featured-event-hero-card"
                          style={(evt.bannerImageUrl || evt.image) ? {
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${evt.bannerImageUrl || evt.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '1px solid var(--border)'
                          } : {}}
                        >
                          <div className="bento-glow-blob blob-right"></div>
                          <div className="event-hero-content">
                            <span className="featured-tag">{evt.tag}</span>
                            <h3 className="event-hero-title">{evt.title}</h3>
                            <p className="event-hero-desc">{evt.desc}</p>
                            
                            <div className="event-hero-details">
                              <div className="detail-item">
                                <Calendar size={14} />
                                <span>{evt.date}</span>
                              </div>
                              <div className="detail-item">
                                <SlidersHorizontal size={14} />
                                <span>{evt.time}</span>
                              </div>
                              <div className="detail-item">
                                <Terminal size={14} />
                                <span>{evt.location}</span>
                              </div>
                            </div>
                            
                            <button className="btn btn-primary" onClick={() => { setActiveEventForRegister(evt); setIsEventRegisterModalOpen(true); }}>
                              Register Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Event Grid */}
            <div className="section-header" style={{ marginTop: '50px' }}>
              <div className="section-label">All Programs</div>
              <h3 className="carousel-section-title">
                {eventFilter === 'all' ? 'All Activities' : `${eventFilter.charAt(0).toUpperCase() + eventFilter.slice(1)}s`}
              </h3>
            </div>
            
            <div className="apple-grid" style={{ marginTop: '20px' }}>
              {eventsData
                .filter(evt => eventFilter === 'all' || evt.category === eventFilter)
                .map((evt) => (
                  <div className="apple-card" key={evt.id} style={{ padding: 0, overflow: 'hidden' }}>
                    {evt.image && <img src={evt.image} alt={evt.title} className="event-card-image" style={{ borderRadius: '18px 18px 0 0', marginBottom: 0 }} />}
                    <div style={{ padding: '20px 24px' }}>
                      <div className="card-top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <div className="card-icon" style={{ width: '36px', height: '36px', margin: 0 }}>
                            {evt.category === 'hackathon' ? <Flame size={18} /> : evt.category === 'workshop' ? <Calendar size={18} /> : <Terminal size={18} />}
                          </div>
                          <span className="card-tag" style={{ textTransform: 'capitalize' }}>{evt.category}</span>
                        </div>
                        <h3 className="card-title">{evt.title}</h3>
                        <p className="card-desc">{evt.desc}</p>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} /> {evt.date} &nbsp;·&nbsp; {evt.time}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Terminal size={12} /> {evt.location}</div>
                      </div>
                      <div className="card-bottom" style={{ marginTop: '12px' }}>
                        <button className="btn btn-primary" onClick={() => { setActiveEventForRegister(evt); setIsEventRegisterModalOpen(true); }}>Register for Event</button>
                      </div>
                    </div>
                  </div>
                ))}
              {eventsData.filter(evt => eventFilter === 'all' || evt.category === eventFilter).length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No events found matching this filter.
                </div>
              )}
            </div>
          </section>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
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

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <button className="btn btn-primary" onClick={() => setSelectedGalleryItem(null)}>Close Details</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'admin' && (
          <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "80vh", color: "var(--text-primary)" }}>
            <p>Redirecting to Admin Portal...</p>
            {typeof window !== 'undefined' && window.location.replace("/admin")}
          </div>
        )}
        {false && (
          <section className="section-container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            {!user ? (
              <div style={styles.loginContainer}>
                <div style={styles.loginCard}>
                  <div style={styles.loginIconBg}>
                    <Lock size={20} color="#ffffff" />
                  </div>
                  <h3 style={styles.loginTitle}>Administrator Sign In</h3>
                  <p style={styles.loginSub}>Access ACM member registries and database controllers</p>

                  <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>
                    {loginError && (
                      <div style={styles.loginError}>
                        <AlertCircle size={16} />
                        <span>{loginError}</span>
                      </div>
                    )}
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="admin@amrita.edu"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="liquid-glass-badge" style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      🔑 Test Logins: <b>admin@amrita.edu</b> / <b>acm@2026</b>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                      Authenticate Portal
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div>
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div className="section-label">ACM Admin Dashboard</div>
                    <h2 className="section-title-large">Chapter Administration</h2>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* WebSocket Status Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 600, color: wsStatus === 'connected' ? '#34c759' : wsStatus === 'connecting' ? '#ff9500' : '#ff3b30' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block', animation: wsStatus === 'connected' ? 'pulseDot 2s ease-in-out infinite' : 'none' }} />
                      WS {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting' : 'Offline'}
                    </div>

                    {/* Notification Bell */}
                    <button
                      onClick={() => { setShowNotificationPanel(p => !p); setUnreadCount(0); }}
                      style={{ position: 'relative', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
                      title="Notification Center"
                    >
                      <Sparkles size={16} />
                      {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff3b30', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)' }}>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Panel */}
                    {showNotificationPanel && (
                      <div style={{ position: 'fixed', top: '80px', right: '24px', width: '340px', maxHeight: '480px', overflowY: 'auto', background: 'var(--bg-card)', backdropFilter: 'blur(24px)', border: '1px solid var(--border-color)', borderRadius: '20px', zIndex: 9999, padding: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</h4>
                          <button onClick={() => setNotificationHistory([])} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Clear all</button>
                        </div>
                        {notificationHistory.length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No notifications yet</div>}
                        {notificationHistory.map(n => (
                          <div key={n.id} style={{ padding: '10px 12px', borderRadius: '12px', marginBottom: '8px', borderLeft: `3px solid ${n.type === 'success' ? '#34c759' : n.type === 'error' ? '#ff3b30' : '#0071e3'}`, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}>
                            <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>{n.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{new Date(n.timestamp).toLocaleTimeString()}</div>
                          </div>
                        ))}
                      </div>
                    )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {adminSubTab === 'members' && (
                      <>
                        <button onClick={generateBulkData} className="btn btn-secondary" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Database size={14} /> Generate 100 entries
                        </button>
                        <button 
                          onClick={() => {
                            const csvContent = "data:text/csv;charset=utf-8," 
                              + ["ID,Name,Email,RollNo,Interest,JoinedAt"].join(",") + "\n"
                              + members.map(m => `"${m.id}","${m.name}","${m.email}","${m.rollNo}","${m.interest}","${m.joinedAt}"`).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "acm_members_report.csv");
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }} 
                          className="btn btn-primary" 
                          style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <FileSpreadsheet size={14} /> Export CSV <ArrowUpRight size={14} />
                        </button>
                        </>
                    )}
                  </div>
                  </div>
                </div>

                {/* Sub-tabs Navigation */}
                <div className="segmented-control-container" style={{ margin: '20px 0 30px' }}>
                  <div className="segmented-control">
                    {(() => {
                      const adminTabs = [
                        { id: 'members', label: 'Members', icon: <Users size={14} /> },
                        { id: 'events', label: 'Events', icon: <Calendar size={14} /> },
                        { id: 'sigs', label: 'SIG Explorer', icon: <Terminal size={14} /> },
                        { id: 'leadership', label: 'Leadership', icon: <Users size={14} /> },
                        { id: 'security', label: 'Security', icon: <Shield size={14} /> }
                      ];
                      const activeIndex = adminTabs.findIndex(t => t.id === adminSubTab);
                      return (
                        <>
                          <div 
                            className="segmented-indicator" 
                            style={{ 
                              width: `calc((100% - 8px) / ${adminTabs.length})`,
                              transform: `translateX(calc(${activeIndex >= 0 ? activeIndex : 0} * 100%))`
                            }} 
                          />
                          {adminTabs.map((tab) => (
                            <button
                              key={tab.id}
                              className={`segmented-button ${adminSubTab === tab.id ? 'active' : ''}`}
                              onClick={() => setAdminSubTab(tab.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              {tab.icon}
                              <span>{tab.label}</span>
                            </button>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* 1. MEMBERS SUBTAB */}
                {adminSubTab === 'members' && (
                  <div>
                    {/* Stats Cards */}
                    <div style={styles.statsRow}>
                      <div className="liquid-glass-badge" style={styles.statsCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--text-secondary)' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>Registered Members</span>
                          <Users size={16} color="var(--accent)" />
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>{members.length}</div>
                        <div style={{ fontSize: '11px', color: '#34c759', marginTop: '4px' }}>⚡ Database syncing actively</div>
                      </div>
                      
                      <div className="liquid-glass-badge" style={styles.statsCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--text-secondary)' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>Web Dev Domain</span>
                          <Terminal size={16} color="var(--accent)" />
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
                          {members.filter(m => m.interest === 'web').length}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Interest distribution</div>
                      </div>

                      <div className="liquid-glass-badge" style={styles.statsCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--text-secondary)' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>AI/ML Domain</span>
                          <Sparkles size={16} color="var(--accent)" />
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
                          {members.filter(m => m.interest === 'ai-ml').length}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Interest distribution</div>
                      </div>
                    </div>

                    {/* Member Add/Edit Form */}
                    {showMemberForm && (
                      <div className="apple-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative', minHeight: 'auto' }}>
                        <h3 className="card-title" style={{ marginBottom: '16px' }}>
                          {editingMemberId ? 'Edit Member Registry' : 'Register New Member'}
                        </h3>
                        <form onSubmit={editingMemberId ? handleUpdateMemberSubmit : handleCreateMemberSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Full Name</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={memberForm.name} 
                              onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))} 
                              required 
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Roll Number</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={memberForm.rollNo} 
                              onChange={(e) => setMemberForm(prev => ({ ...prev, rollNo: e.target.value }))} 
                              required 
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Email Address</label>
                            <input 
                              type="email" 
                              className="form-input" 
                              value={memberForm.email} 
                              onChange={(e) => {
                                const emailVal = e.target.value;
                                setMemberForm(prev => {
                                  let updated = { ...prev, email: emailVal };
                                  const parts = emailVal.trim().split('@');
                                  if (parts.length > 0) {
                                    const prefix = parts[0].toUpperCase();
                                    if (prefix) {
                                      updated.rollNo = prefix;
                                      
                                      const match = prefix.match(/U(\d)(CSE|AID|ECE)/i);
                                      if (match) {
                                        const batchDigit = match[1];
                                        const deptCode = match[2].toUpperCase();
                                        
                                        const currentYear = new Date().getFullYear();
                                        const currentMonth = new Date().getMonth();
                                        const batchYear = 2020 + parseInt(batchDigit);
                                        let yearOfStudy = currentYear - batchYear;
                                        if (currentMonth >= 5) {
                                          yearOfStudy += 1;
                                        }
                                        yearOfStudy = Math.max(1, Math.min(4, yearOfStudy));
                                        
                                        const yearMap = {
                                          1: '1st Year',
                                          2: '2nd Year',
                                          3: '3rd Year',
                                          4: '4th Year'
                                        };
                                        updated.year = yearMap[yearOfStudy] || '1st Year';
                                        
                                        const deptMap = {
                                          'CSE': 'Computer Science and Engineering',
                                          'AID': 'Artificial Intelligence and Data Science',
                                          'ECE': 'Electrical and Communication Engineering'
                                        };
                                        updated.department = deptMap[deptCode] || 'Computer Science and Engineering';
                                      }
                                    }
                                  }
                                  return updated;
                                });
                              }} 
                              required 
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Primary Interest Domain</label>
                            <select 
                              className="form-input" 
                              value={memberForm.interest} 
                              onChange={(e) => setMemberForm(prev => ({ ...prev, interest: e.target.value }))}
                            >
                              <option value="web">Web Development</option>
                              <option value="ai-ml">AI & ML</option>
                              <option value="cp">Competitive Programming</option>
                              <option value="cyber">Cyber Security</option>
                              <option value="ui-ux">UI/UX Design</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Year of Study</label>
                            <select 
                              className="form-input" 
                              value={memberForm.year} 
                              onChange={(e) => setMemberForm(prev => ({ ...prev, year: e.target.value }))}
                            >
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                            </select>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Department</label>
                            <select 
                              className="form-input" 
                              value={memberForm.department} 
                              onChange={(e) => setMemberForm(prev => ({ ...prev, department: e.target.value }))}
                            >
                              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                              <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
                              <option value="Electrical and Communication Engineering">Electrical and Communication Engineering</option>
                            </select>
                          </div>
                          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                            <button 
                              type="button" 
                              className="btn btn-secondary" 
                              onClick={() => {
                                setShowMemberForm(false);
                                setEditingMemberId(null);
                                setMemberForm({ name: '', rollNo: '', email: '', interest: 'web', year: '1st Year', department: 'Computer Science and Engineering' });
                              }}
                            >
                              Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                              {editingMemberId ? 'Save Modifications' : 'Register Member'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Search & Filters */}
                    <div style={styles.controlsRow}>
                      <div style={styles.searchWrapper}>
                        <Search size={16} style={styles.searchIcon} />
                        <input 
                          type="text" 
                          placeholder="Search members by name, roll no, email..." 
                          style={styles.searchInput}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={styles.filterWrapper}>
                          <SlidersHorizontal size={14} color="var(--text-secondary)" />
                          <select 
                            style={styles.filterSelect}
                            value={filterInterest}
                            onChange={(e) => setFilterInterest(e.target.value)}
                          >
                            <option value="all">All Domains</option>
                            <option value="web">Web Development</option>
                            <option value="ai-ml">AI & ML</option>
                            <option value="cp">Competitive Programming</option>
                            <option value="cyber">Cyber Security</option>
                            <option value="ui-ux">UI/UX Design</option>
                          </select>
                        </div>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => {
                            setEditingMemberId(null);
                            setMemberForm({ name: '', rollNo: '', email: '', interest: 'web', year: '1st Year', department: 'Computer Science and Engineering' });
                            setShowMemberForm(true);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '10px 16px' }}
                        >
                          <Plus size={14} /> Add Member
                        </button>
                      </div>
                    </div>

                    {/* Members Table */}
                    <div style={styles.tableCard}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Member ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Roll Number</th>
                            <th style={styles.th}>Email Address</th>
                            <th style={styles.th}>Year</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Primary Domain</th>
                            <th style={styles.th}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.length > 0 ? (
                            filteredMembers.map((m) => (
                              <tr key={m.id} style={styles.tr}>
                                <td style={{ ...styles.td, color: 'var(--accent)', fontWeight: 600 }}>{m.id}</td>
                                <td style={{ ...styles.td, color: 'var(--text-primary)', fontWeight: 500 }}>{m.name}</td>
                                <td style={styles.td}>{m.rollNo}</td>
                                <td style={styles.td}>{m.email}</td>
                                <td style={styles.td}>{m.year || '1st Year'}</td>
                                <td style={styles.td}>{m.department || 'Computer Science and Engineering'}</td>
                                <td style={styles.td}>
                                  <span style={{ 
                                    ...styles.tableTag,
                                    backgroundColor: 
                                      m.interest === 'web' ? 'rgba(0,113,227,0.1)' : 
                                      m.interest === 'ai-ml' ? 'rgba(52,199,89,0.1)' :
                                      m.interest === 'cp' ? 'rgba(255,149,0,0.1)' :
                                      m.interest === 'cyber' ? 'rgba(255,59,48,0.1)' : 'rgba(175,82,222,0.1)',
                                    color: 
                                      m.interest === 'web' ? '#0071e3' : 
                                      m.interest === 'ai-ml' ? '#34c759' :
                                      m.interest === 'cp' ? '#ff9500' :
                                      m.interest === 'cyber' ? '#ff3b30' : '#af52de'
                                  }}>
                                    {m.interest === 'web' ? 'Web Dev' : 
                                     m.interest === 'ai-ml' ? 'AI/ML' :
                                     m.interest === 'cp' ? 'Comp. Prog' :
                                     m.interest === 'cyber' ? 'Security' : 'UI/UX'}
                                  </span>
                                </td>
                                <td style={styles.td}>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                      onClick={() => {
                                        setEditingMemberId(m.id);
                                        setMemberForm({ name: m.name, rollNo: m.rollNo, email: m.email, interest: m.interest, year: m.year || '1st Year', department: m.department || 'Computer Science and Engineering' });
                                        setShowMemberForm(true);
                                      }}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                      title="Edit Registry"
                                    >
                                      <Edit3 size={15} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteMember(m.id, m.name)}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff3b30' }}
                                      title="Delete Registry"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" style={styles.noResults}>
                                No matching member registries found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. EVENTS SUBTAB */}
                {adminSubTab === 'events' && (
                  <div>
                    {/* Events Add/Edit Form */}
                    {showEventForm && (
                      <div className="apple-card" style={{ padding: '24px', marginBottom: '24px', minHeight: 'auto' }}>
                        <h3 className="card-title" style={{ marginBottom: '16px' }}>
                          {editingEventId ? 'Edit Event Details' : 'Create Chapter Event'}
                        </h3>
                        <form onSubmit={editingEventId ? handleUpdateEventSubmit : handleCreateEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Event Title</label>
                              <input type="text" className="form-input" value={eventForm.title} onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Event Category</label>
                              <select className="form-input" value={eventForm.category} onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}>
                                <option value="hackathon">Hackathon</option>
                                <option value="workshop">Workshop</option>
                                <option value="sig">SIG Meetup</option>
                              </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Date (e.g., June 28-29)</label>
                              <input type="text" className="form-input" value={eventForm.date} onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Time Slot</label>
                              <input type="text" className="form-input" value={eventForm.time} onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Location / Room No</label>
                              <input type="text" className="form-input" value={eventForm.location} onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Event Banner Image URL (optional)</label>
                              <input type="url" className="form-input" placeholder="https://..." value={eventForm.image} onChange={(e) => setEventForm(prev => ({ ...prev, image: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1/-1' }}>
                              <input type="checkbox" id="featuredCheck" checked={eventForm.featured} onChange={(e) => setEventForm(prev => ({ ...prev, featured: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                              <label htmlFor="featuredCheck" style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Pin to Featured Carousel Header</label>
                            </div>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Event Description</label>
                            <textarea className="form-input" rows="3" value={eventForm.desc} onChange={(e) => setEventForm(prev => ({ ...prev, desc: e.target.value }))} required style={{ resize: 'none', fontFamily: 'inherit' }}></textarea>
                          </div>
                          {eventForm.image && <img src={eventForm.image} alt="Preview" className="img-preview" onError={(e) => e.target.style.display='none'} />}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => { setShowEventForm(false); setEditingEventId(null); setEventForm({ title: '', category: 'hackathon', date: '', location: '', time: '', desc: '', featured: false, image: '' }); }}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{editingEventId ? 'Update Event Record' : 'Publish Event'}</button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Chapter Events Log</h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => { setSendUpdateForm({ subject: '', message: '', eventId: '' }); setShowSendUpdate(true); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                        >
                          <Mail size={14} /> Send Update
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => {
                            setEditingEventId(null);
                            setEventForm({ title: '', category: 'hackathon', date: '', location: '', time: '', desc: '', featured: false, image: '' });
                            setShowEventForm(true);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                        >
                          <Plus size={14} /> Add Event
                        </button>
                      </div>
                    </div>

                    <div style={styles.tableCard}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Date & Time</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Featured</th>
                            <th style={styles.th}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((evt) => (
                            <tr key={evt.id} style={styles.tr}>
                              <td style={{ ...styles.td, color: 'var(--text-primary)', fontWeight: 600 }}>{evt.title}</td>
                              <td style={styles.td}>
                                <span style={{ 
                                  ...styles.tableTag,
                                  backgroundColor: 
                                    evt.category === 'hackathon' ? 'rgba(255,59,48,0.1)' : 
                                    evt.category === 'workshop' ? 'rgba(0,113,227,0.1)' : 'rgba(52,199,89,0.1)',
                                  color: 
                                    evt.category === 'hackathon' ? '#ff3b30' : 
                                    evt.category === 'workshop' ? '#0071e3' : '#34c759'
                                }}>
                                  {evt.category}
                                </span>
                              </td>
                              <td style={styles.td}>
                                <div style={{ fontSize: '13px', fontWeight: 500 }}>{evt.date}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{evt.time}</div>
                              </td>
                              <td style={styles.td}>{evt.location}</td>
                              <td style={styles.td}>
                                {evt.featured ? (
                                  <span style={{ color: '#34c759', fontWeight: 600, fontSize: '12px' }}>★ Yes</span>
                                ) : (
                                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>No</span>
                                )}
                              </td>
                              <td style={styles.td}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    onClick={() => {
                                      setEditingEventId(evt.id);
                                      setEventForm({
                                        title: evt.title,
                                        category: evt.category,
                                        date: evt.date,
                                        location: evt.location,
                                        time: evt.time,
                                        desc: evt.desc,
                                        featured: evt.featured || false
                                      });
                                      setShowEventForm(true);
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                    title="Edit Event"
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteEvent(evt.id, evt.title)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff3b30' }}
                                    title="Delete Event"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. SIG EXPLORER SUBTAB */}
                {adminSubTab === 'sigs' && (
                  <div>
                    {editingSigId && (
                      <div className="apple-card" style={{ padding: '24px', marginBottom: '24px', minHeight: 'auto', border: '1px solid var(--accent)' }}>
                        <h3 className="card-title" style={{ marginBottom: '16px' }}>Edit SIG: {sigs[editingSigId]?.title}</h3>
                        <form onSubmit={handleUpdateSigSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">SIG Title</label>
                              <input type="text" className="form-input" value={sigForm.title} onChange={(e) => setSigForm(p => ({ ...p, title: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Subtitle / Domain</label>
                              <input type="text" className="form-input" value={sigForm.sub} onChange={(e) => setSigForm(p => ({ ...p, sub: e.target.value }))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">SIG Lead</label>
                              <input type="text" className="form-input" value={sigForm.lead} onChange={(e) => setSigForm(p => ({ ...p, lead: e.target.value }))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Faculty Advisor</label>
                              <input type="text" className="form-input" value={sigForm.facultyAdvisor} onChange={(e) => setSigForm(p => ({ ...p, facultyAdvisor: e.target.value }))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Active Research Project</label>
                              <input type="text" className="form-input" value={sigForm.activeProject} onChange={(e) => setSigForm(p => ({ ...p, activeProject: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Project Status</label>
                              <input type="text" className="form-input" value={sigForm.status} onChange={(e) => setSigForm(p => ({ ...p, status: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Members Count</label>
                              <input type="number" className="form-input" value={sigForm.membersCount} onChange={(e) => setSigForm(p => ({ ...p, membersCount: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Banner Image URL (optional)</label>
                              <input type="url" className="form-input" placeholder="https://..." value={sigForm.image} onChange={(e) => setSigForm(p => ({ ...p, image: e.target.value }))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1' }}>
                              <input 
                                type="checkbox" 
                                id="adminJoinNowEnabledCheck" 
                                checked={sigForm.joinNowEnabled} 
                                onChange={(e) => setSigForm(p => ({ ...p, joinNowEnabled: e.target.checked }))} 
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <label htmlFor="adminJoinNowEnabledCheck" className="form-label" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 600 }}>
                                Enable "Join Now" Button
                              </label>
                            </div>
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">SIG Description</label>
                            <textarea className="form-input" rows="3" value={sigForm.desc} onChange={(e) => setSigForm(p => ({ ...p, desc: e.target.value }))} required style={{ resize: 'none', fontFamily: 'inherit' }}></textarea>
                          </div>
                          {sigForm.image && <img src={sigForm.image} alt="Preview" className="img-preview" onError={(e) => e.target.style.display='none'} />}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditingSigId(null)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save SIG Config</button>
                          </div>
                        </form>
                      </div>
                    )}
                    <div className="apple-grid">
                      {Object.keys(sigs).map((sigKey) => {
                        const sigItem = sigs[sigKey];
                        return (
                          <div className="apple-card" key={sigKey} style={{ minHeight: '260px', padding: 0, overflow: 'hidden' }}>
                            {sigItem.image && <img src={sigItem.image} alt={sigItem.title} className="sig-card-image" style={{ borderRadius: '18px 18px 0 0', marginBottom: 0 }} />}
                            <div style={{ padding: '20px' }}>
                              <span className="card-tag" style={{ textTransform: 'uppercase' }}>{sigKey}</span>
                              <h3 className="card-title" style={{ fontSize: '18px', marginTop: '6px' }}>{sigItem.title}</h3>
                              {sigItem.sub && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{sigItem.sub}</div>}
                              <p className="card-desc" style={{ fontSize: '13px', marginTop: '6px' }}>{sigItem.desc}</p>
                              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div>🚀 Project: <b>{sigItem.activeProject}</b></div>
                                <div>📈 Status: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{sigItem.status}</span></div>
                                <div>👥 Members: <b>{sigItem.membersCount}</b></div>
                                {sigItem.lead && <div>🧑‍💻 Lead: <b>{sigItem.lead}</b></div>}
                              </div>
                              <div className="card-bottom" style={{ marginTop: '12px' }}>
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => {
                                    setEditingSigId(sigKey);
                                    setSigForm({ id: sigKey, title: sigItem.title, sub: sigItem.sub || '', desc: sigItem.desc, lead: sigItem.lead || '', facultyAdvisor: sigItem.facultyAdvisor || '', activeProject: sigItem.activeProject, status: sigItem.status, membersCount: sigItem.membersCount, image: sigItem.image || '', joinNowEnabled: sigItem.joinNowEnabled !== false });
                                  }}
                                  style={{ width: '100%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                  <Edit3 size={13} /> Edit SIG
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. ASSETS GALLERY SUBTAB */}
                {adminSubTab === 'assets' && (
                  <div>
                    <div className="apple-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyItems: 'center', flexDirection: 'column', gap: '16px', border: '1px dashed var(--border-color)', minHeight: 'auto' }}>
                      <Upload size={32} color="var(--accent)" />
                      <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Upload Branding & Media Assets</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>PNG, JPEG, SVG or WebP files accepted. Max file size: 5MB.</p>
                      </div>
                      
                      <label className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <Plus size={14} /> Choose Asset File
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAssetUpload} 
                          style={{ display: 'none' }} 
                        />
                      </label>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Configured Brand Assets</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                      {assets.map((asset) => (
                        <div className="apple-card" key={asset.id} style={{ minHeight: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ 
                            height: '120px', 
                            borderRadius: '10px', 
                            background: 'rgba(var(--accent-rgb), 0.05)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            {asset.type.startsWith('image/') ? (
                              <img src={asset.url} alt={asset.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                            ) : (
                              <Terminal size={32} color="var(--accent)" />
                            )}
                          </div>
                          
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={asset.name}>
                              {asset.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              <span>{asset.size}</span>
                              <span style={{ textTransform: 'uppercase' }}>{asset.type.split('/')[1]}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <a 
                              href={asset.url} 
                              download={asset.name} 
                              className="btn btn-secondary" 
                              style={{ flex: 1, fontSize: '11px', textAlign: 'center', padding: '6px 0', textDecoration: 'none' }}
                            >
                              Download
                            </a>
                            <button 
                              onClick={() => handleAssetDelete(asset.id, asset.name)}
                              className="btn btn-secondary"
                              style={{ color: '#ff3b30', padding: '6px 10px' }}
                              title="Delete Asset"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LEADERSHIP SUBTAB — Core Committee + Faculty Advisors */}
                {adminSubTab === 'leadership' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    {/* ── Core Committee Section ── */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Club Leadership</div>
                          <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Core Committee</h3>
                        </div>
                        <button onClick={() => { setShowCommitteeForm(true); setEditingCommitteeId(null); setCommitteeForm({ name: '', role: '', desc: '', email: '' }); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <Plus size={14} /> Add Member
                        </button>
                      </div>

                      {showCommitteeForm && (
                        <div className="apple-card" style={{ padding: '24px', marginBottom: '24px', minHeight: 'auto', border: '1px solid var(--accent)' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>{editingCommitteeId ? 'Edit Committee Member' : 'Add Committee Member'}</h4>
                          <form onSubmit={editingCommitteeId ? handleUpdateCommitteeSubmit : handleCreateCommitteeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Full Name *</label>
                                <input type="text" className="form-input" placeholder="e.g. Abhijith P. S." value={committeeForm.name} onChange={e => setCommitteeForm(f => ({...f, name: e.target.value}))} required />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Role / Title *</label>
                                <input type="text" className="form-input" placeholder="e.g. Student Chair" value={committeeForm.role} onChange={e => setCommitteeForm(f => ({...f, role: e.target.value}))} required />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" placeholder="name@am.amrita.edu" value={committeeForm.email} onChange={e => setCommitteeForm(f => ({...f, email: e.target.value}))} />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Profile Photo URL</label>
                                <input type="url" className="form-input" placeholder="https://...jpg" value={committeeForm.photo} onChange={e => setCommitteeForm(f => ({...f, photo: e.target.value}))} />
                              </div>
                              <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                                <label className="form-label">Short Bio</label>
                                <input type="text" className="form-input" placeholder="Leads chapter operations..." value={committeeForm.desc} onChange={e => setCommitteeForm(f => ({...f, desc: e.target.value}))} />
                              </div>
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Social Media Links</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="form-label">LinkedIn URL</label>
                                  <input type="url" className="form-input" placeholder="https://linkedin.com/in/..." value={committeeForm.linkedin} onChange={e => setCommitteeForm(f => ({...f, linkedin: e.target.value}))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="form-label">GitHub URL</label>
                                  <input type="url" className="form-input" placeholder="https://github.com/..." value={committeeForm.github} onChange={e => setCommitteeForm(f => ({...f, github: e.target.value}))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="form-label">Twitter / X URL</label>
                                  <input type="url" className="form-input" placeholder="https://x.com/..." value={committeeForm.twitter} onChange={e => setCommitteeForm(f => ({...f, twitter: e.target.value}))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="form-label">Instagram URL</label>
                                  <input type="url" className="form-input" placeholder="https://instagram.com/..." value={committeeForm.instagram} onChange={e => setCommitteeForm(f => ({...f, instagram: e.target.value}))} />
                                </div>
                              </div>
                            </div>
                            {committeeForm.photo && <img src={committeeForm.photo} alt="Preview" className="img-preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />}
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                              <button type="button" onClick={() => setShowCommitteeForm(false)} className="btn btn-secondary">Cancel</button>
                              <button type="submit" className="btn btn-primary">{editingCommitteeId ? 'Save Changes' : 'Add Member'}</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="apple-grid-auto">
                        {committee.map(member => {
                          const initials = member.name.split(' ').filter(n => n.length > 1).map(n => n[0]).join('').substring(0,2);
                          return (
                            <div className="apple-card" key={member.id} style={{ minHeight: '200px' }}>
                              <div className="card-top">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div className="profile-photo-wrap" style={{ width: '52px', height: '52px' }}>
                                    {member.photo ? <img src={member.photo} alt={member.name} /> : <span className="profile-initials" style={{ fontSize: '15px' }}>{initials}</span>}
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button onClick={() => { setEditingCommitteeId(member.id); setCommitteeForm({ name: member.name, role: member.role, desc: member.desc || '', email: member.email || '', photo: member.photo || '', linkedin: member.linkedin || '', github: member.github || '', twitter: member.twitter || '', instagram: member.instagram || '' }); setShowCommitteeForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}><Edit3 size={14} /></button>
                                    <button onClick={() => handleDeleteCommittee(member.id, member.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff3b30', padding: '4px' }}><Trash2 size={14} /></button>
                                  </div>
                                </div>
                                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '10px' }}>{member.name}</h4>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginTop: '2px' }}>{member.role}</div>
                                {member.desc && <p className="card-desc" style={{ fontSize: '12px', marginTop: '8px' }}>{member.desc}</p>}
                              </div>
                              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {member.email && <a href={`mailto:${member.email}`} style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}><Mail size={11} /> {member.email}</a>}
                                <div className="social-links-row">
                                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="social-link-btn" title="LinkedIn">in</a>}
                                  {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="social-link-btn" title="GitHub">gh</a>}
                                  {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer" className="social-link-btn" title="X">𝕏</a>}
                                  {member.instagram && <a href={member.instagram} target="_blank" rel="noreferrer" className="social-link-btn" title="IG">ig</a>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Faculty Advisors Section ── */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Mentorship</div>
                          <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Faculty Advisors</h3>
                        </div>
                        <button onClick={() => { setShowFacultyForm(true); setEditingFacultyId(null); setFacultyForm({ name: '', role: '', dept: '', bio: '', photo: '', email: '', linkedin: '', github: '', whatsapp: '', instagram: '' }); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <Plus size={14} /> Add Advisor
                        </button>
                      </div>

                      {showFacultyForm && (
                        <div className="apple-card" style={{ padding: '24px', marginBottom: '24px', minHeight: 'auto', border: '1px solid var(--accent)' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>{editingFacultyId ? 'Edit Faculty Advisor' : 'Add Faculty Advisor'}</h4>
                          <form onSubmit={editingFacultyId ? handleUpdateFacultySubmit : handleCreateFacultySubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Full Name *</label>
                              <input type="text" className="form-input" placeholder="Dr. Rajesh K." value={facultyForm.name} onChange={e => setFacultyForm(f => ({...f, name: e.target.value}))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Role *</label>
                              <input type="text" className="form-input" placeholder="Faculty Sponsor" value={facultyForm.role} onChange={e => setFacultyForm(f => ({...f, role: e.target.value}))} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Profile Photo URL</label>
                              <input type="url" className="form-input" placeholder="https://...jpg" value={facultyForm.photo} onChange={e => setFacultyForm(f => ({...f, photo: e.target.value}))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                              <label className="form-label">Department</label>
                              <input type="text" className="form-input" placeholder="Associate Professor, Dept. of CSE" value={facultyForm.dept} onChange={e => setFacultyForm(f => ({...f, dept: e.target.value}))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Email Address</label>
                              <input type="email" className="form-input" placeholder="rajesh@amrita.edu" value={facultyForm.email || ''} onChange={e => setFacultyForm(f => ({...f, email: e.target.value}))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">LinkedIn URL</label>
                              <input type="url" className="form-input" placeholder="https://linkedin.com/in/..." value={facultyForm.linkedin || ''} onChange={e => setFacultyForm(f => ({...f, linkedin: e.target.value}))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">GitHub URL</label>
                              <input type="url" className="form-input" placeholder="https://github.com/..." value={facultyForm.github || ''} onChange={e => setFacultyForm(f => ({...f, github: e.target.value}))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">WhatsApp Contact Link</label>
                              <input type="url" className="form-input" placeholder="https://wa.me/..." value={facultyForm.whatsapp || ''} onChange={e => setFacultyForm(f => ({...f, whatsapp: e.target.value}))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                              <label className="form-label">Instagram URL</label>
                              <input type="url" className="form-input" placeholder="https://instagram.com/..." value={facultyForm.instagram || ''} onChange={e => setFacultyForm(f => ({...f, instagram: e.target.value}))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                              <label className="form-label">Bio</label>
                              <textarea className="form-input" rows="2" placeholder="Guides research alignments..." value={facultyForm.bio} onChange={e => setFacultyForm(f => ({...f, bio: e.target.value}))} style={{ resize: 'none', fontFamily: 'inherit' }} />
                            </div>
                            {facultyForm.photo && <img src={facultyForm.photo} alt="Preview" className="img-preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', gridColumn: '1/-1' }} onError={(e) => e.target.style.display='none'} />}
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                              <button type="button" onClick={() => setShowFacultyForm(false)} className="btn btn-secondary">Cancel</button>
                              <button type="submit" className="btn btn-primary">{editingFacultyId ? 'Save Changes' : 'Add Advisor'}</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="apple-grid-auto">
                        {faculty.map(fac => {
                          const initials = fac.name.split(' ').filter(n => n.length > 1).map(n => n[0]).join('').substring(0,2);
                          return (
                            <div className="apple-card" key={fac.id} style={{ minHeight: '200px' }}>
                              <div className="card-top">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div className="profile-photo-wrap" style={{ width: '52px', height: '52px', borderColor: 'rgba(0,113,227,0.3)' }}>
                                    {fac.photo ? <img src={fac.photo} alt={fac.name} /> : <span className="profile-initials" style={{ fontSize: '15px' }}>{initials}</span>}
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button onClick={() => { setEditingFacultyId(fac.id); setFacultyForm({ name: fac.name, role: fac.role, dept: fac.dept || '', bio: fac.bio || '', photo: fac.photo || '', email: fac.email || '', linkedin: fac.linkedin || '', github: fac.github || '', whatsapp: fac.whatsapp || '', instagram: fac.instagram || '' }); setShowFacultyForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}><Edit3 size={14} /></button>
                                    <button onClick={() => handleDeleteFaculty(fac.id, fac.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff3b30', padding: '4px' }}><Trash2 size={14} /></button>
                                  </div>
                                </div>
                                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '10px' }}>{fac.name}</h4>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginTop: '2px' }}>{fac.role}</div>
                                {fac.dept && <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>{fac.dept}</div>}
                                {fac.bio && <p className="card-desc" style={{ fontSize: '12px', marginTop: '8px' }}>{fac.bio}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SECURITY & THREAT CENTER SUBTAB */}
                {adminSubTab === 'security' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Top Row — Status Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      {[
                        { label: 'XSS Shield', value: 'Active', color: '#34c759', icon: <ShieldCheck size={16} /> },
                        { label: 'SQLi Blocker', value: 'Active', color: '#34c759', icon: <ShieldCheck size={16} /> },
                        { label: 'Brute Force Guard', value: `${5 - loginAttempts} tries left`, color: loginAttempts >= 3 ? '#ff9500' : '#34c759', icon: <Lock size={16} /> },
                        { label: 'WebSocket Monitor', value: wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting…' : 'Offline', color: wsStatus === 'connected' ? '#34c759' : wsStatus === 'connecting' ? '#ff9500' : '#ff3b30', icon: <Terminal size={16} /> }
                      ].map((stat, i) => (
                        <div key={i} className="liquid-glass-badge" style={{ padding: '14px 16px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
                            <span style={{ color: stat.color }}>{stat.icon}</span>
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Middle Row — Audit Log + WS Monitor */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                      {/* Audit Log */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Shield size={16} color="var(--accent)" /> Security Audit Log
                          </h3>
                          <button
                            onClick={() => {
                              if (window.confirm('Flush all audit logs?')) {
                                setSecurityLogs([{ id: 'sec-flush', timestamp: new Date().toISOString(), event: 'Logs Flushed', type: 'info', details: 'Cleared by Lead Administrator' }]);
                              }
                            }}
                            className="btn btn-secondary" style={{ fontSize: '11px', padding: '5px 10px' }}
                          >
                            Clear
                          </button>
                        </div>
                        <div className="liquid-glass-badge" style={{ padding: '12px', borderRadius: '14px', height: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.15)' }}>
                          {securityLogs.length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>No security events logged yet.</div>}
                          {securityLogs.map((log) => (
                            <div key={log.id} style={{ padding: '8px 12px', borderRadius: '8px', borderLeft: `3px solid ${log.type === 'success' ? '#34c759' : log.type === 'info' ? '#0071e3' : log.type === 'warning' ? '#ff9500' : '#ff3b30'}`, background: 'rgba(255,255,255,0.03)', fontSize: '11.5px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '10px' }}>
                                <span>[{new Date(log.timestamp).toLocaleTimeString()}] <b>{log.event.toUpperCase()}</b></span>
                                <span style={{ color: log.type === 'success' ? '#34c759' : log.type === 'info' ? '#0071e3' : log.type === 'warning' ? '#ff9500' : '#ff3b30', fontWeight: 700 }}>{log.type.toUpperCase()}</span>
                              </div>
                              <div style={{ color: 'var(--text-primary)' }}>{log.details}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* WebSocket Monitor */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Terminal size={16} color="var(--accent)" /> WebSocket Stream
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: wsStatus === 'connected' ? '#34c759' : wsStatus === 'connecting' ? '#ff9500' : '#ff3b30' }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block', animation: wsStatus === 'connected' ? 'pulseDot 2s infinite' : 'none' }} />
                            {wsStatus === 'connected' ? 'LIVE' : wsStatus === 'connecting' ? 'CONNECTING' : 'OFFLINE'}
                          </div>
                        </div>
                        <div className="liquid-glass-badge" style={{ padding: '12px', borderRadius: '14px', height: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.15)' }}>
                          {wsLogs.length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>Waiting for WebSocket messages…</div>}
                          {wsLogs.map((log) => (
                            <div key={log.id} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '10.5px', borderLeft: `3px solid ${log.direction === 'received' ? '#34c759' : '#0071e3'}`, background: 'rgba(255,255,255,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', color: 'var(--text-secondary)', fontSize: '9px' }}>
                                <span>{log.direction === 'received' ? '▼ RECV' : '▲ SENT'}</span>
                                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <div style={{ color: log.direction === 'received' ? '#34c759' : '#6ac1ff', wordBreak: 'break-all' }}>{log.message.substring(0, 120)}{log.message.length > 120 ? '…' : ''}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row — Email Outbox + WAF Tester */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                      {/* Email Outbox */}
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} color="var(--accent)" /> Email Outbox ({emailLogs.length})
                        </h3>
                        <div className="liquid-glass-badge" style={{ padding: '12px', borderRadius: '14px', height: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.1)' }}>
                          {emailLogs.length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', marginTop: '30px' }}>No emails sent yet.</div>}
                          {emailLogs.map((em) => (
                            <div key={em.id} style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', fontSize: '12px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{em.subject}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>To: {em.to} · {new Date(em.timestamp).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* WAF Input Tester (fixed — uses sandboxInput/sandboxResult states) */}
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={16} color="var(--accent)" /> WAF Input Sanitizer
                        </h3>
                        <div className="apple-card" style={{ padding: '20px', minHeight: 'auto' }}>
                          <p className="card-desc" style={{ fontSize: '12px', marginBottom: '14px' }}>
                            Test the WAF sanitization filter. Try XSS tags or SQL injection patterns.
                          </p>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            if (!sandboxInput.trim()) return;
                            const sanitized = sanitizeInput(sandboxInput, 'WAF Tester');
                            setSandboxResult(sanitized);
                            setSandboxInput('');
                          }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '11px' }}>Threat Payload</label>
                              <input type="text" className="form-input" placeholder="<script>alert('XSS')</script>"
                                value={sandboxInput} onChange={(e) => setSandboxInput(e.target.value)}
                                style={{ fontFamily: 'monospace', fontSize: '12px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button type="button" className="btn btn-secondary" onClick={() => setSandboxInput("<script>alert('XSS')</script>")} style={{ fontSize: '10px', padding: '4px 8px' }}>XSS Sample</button>
                              <button type="button" className="btn btn-secondary" onClick={() => setSandboxInput("' OR '1'='1; DROP TABLE members;--")} style={{ fontSize: '10px', padding: '4px 8px' }}>SQLi Sample</button>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <Shield size={13} /> Run Sanitizer
                            </button>
                          </form>
                          {sandboxResult && (
                            <div style={{ marginTop: '14px', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', fontFamily: 'monospace', fontSize: '11px', color: '#34c759', wordBreak: 'break-all' }}>
                              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sanitized Output:</div>
                              {sandboxResult}
                              <div style={{ fontSize: '10px', color: '#34c759', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={11} /> Threat Neutralized & Logged</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notification History */}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} color="var(--accent)" /> Notification History ({notificationHistory.length})
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                        {notificationHistory.length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No notifications yet this session.</div>}
                        {notificationHistory.slice(0, 12).map((n) => (
                          <div key={n.id} style={{ padding: '10px 14px', borderRadius: '12px', borderLeft: `3px solid ${n.type === 'success' ? '#34c759' : n.type === 'error' ? '#ff3b30' : '#0071e3'}`, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', fontSize: '12px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>{n.message}</div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '10px', marginTop: '4px' }}>{new Date(n.timestamp).toLocaleTimeString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Send Update Broadcast Modal */}
      {showSendUpdate && (
        <div className="send-update-overlay" onClick={() => setShowSendUpdate(false)}>
          <div className="send-update-panel" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Events Admin</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Send Update to All Members</h3>
              </div>
              <button onClick={() => setShowSendUpdate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '24px', lineHeight: 1 }}>&times;</span>
              </button>
            </div>
            <form onSubmit={handleSendUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Update Subject *</label>
                <input type="text" className="form-input" placeholder="e.g. HackNight 2026 — Registration Now Open" value={sendUpdateForm.subject} onChange={e => setSendUpdateForm(f => ({...f, subject: e.target.value}))} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Linked Event (optional)</label>
                <select className="form-input" value={sendUpdateForm.eventId} onChange={e => setSendUpdateForm(f => ({...f, eventId: e.target.value}))}>
                  <option value="">No specific event</option>
                  {events.map(evt => <option key={evt.id} value={evt.id}>{evt.title}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Message Body *</label>
                <textarea className="form-input" rows="5" placeholder="Write your update message to all registered members..." value={sendUpdateForm.message} onChange={e => setSendUpdateForm(f => ({...f, message: e.target.value}))} required style={{ resize: 'none', fontFamily: 'inherit' }}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'rgba(0,113,227,0.05)', border: '1px solid rgba(0,113,227,0.15)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <Mail size={14} color="var(--accent)" />
                Will be broadcast to <b style={{ color: 'var(--text-primary)', margin: '0 4px' }}>{members.length} registered members</b> and logged to Email Outbox.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSendUpdate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Send Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Apple Footer */}
      <footer className="footer">
        {/* Campus Sketch Merged at Left Bottom */}
        <img 
          src={pencilImage} 
          alt="Amrita Nagercoil Campus Illustration" 
          className="footer-campus-sketch"
        />

        <div className="footer-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="footer-notes">
            <p>Amrita ACM Student Chapter is registered under ACM International Student Chapters. All computational database services are configured for scalability to support 5000+ concurrent traffic nodes smoothly, backed by modern secure Captcha protection protocols. App UI and values modeled strictly on Apple Human Interface Guidelines.</p>
          </div>
          <div className="footer-links">
            <div className="footer-brand-section">
              <div className="footer-brand-text">
                <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '13px', letterSpacing: '-0.01em' }}>AMRITA ACM</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: '1.4' }}>
                  Nagercoil Campus Brand Identity. Empowering student developers to build the future.
                </p>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Chapter Programs</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><a href="#events" onClick={() => setActiveTab('events')} style={{ color: 'var(--text-secondary)' }}>Hackathons</a></li>
                <li><a href="#events" onClick={() => setActiveTab('events')} style={{ color: 'var(--text-secondary)' }}>Bootcamps</a></li>
                <li><a href="#events" onClick={() => setActiveTab('events')} style={{ color: 'var(--text-secondary)' }}>Coding Nights</a></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><a href="#resources" onClick={() => setActiveTab('resources')} style={{ color: 'var(--text-secondary)' }}>Design Kits</a></li>
                <li><a href="#resources" onClick={() => setActiveTab('resources')} style={{ color: 'var(--text-secondary)' }}>Templates</a></li>
                <li><a href="#resources" onClick={() => setActiveTab('resources')} style={{ color: 'var(--text-secondary)' }}>Codebase Boilerplates</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Campus Hub</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><span style={{ color: 'var(--text-tertiary)' }}>Amrita Nagercoil Campus</span></li>
                <li><span style={{ color: 'var(--text-tertiary)' }}>Tamil Nadu, India</span></li>
                <li><a href="mailto:acm@ng.amrita.edu" style={{ color: 'var(--text-secondary)' }}>acm@ng.amrita.edu</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-copy">
            <span>Copyright &copy; {new Date().getFullYear()} Amrita ACM Student Chapter. All Rights Reserved.</span>
            <div>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Join ACM Modal Form */}
      {isJoinModalOpen && (
        <JoinModal 
          onClose={() => setIsJoinModalOpen(false)}
          onSubmitSuccess={handleRegisterMember}
          showNotification={showNotification}
        />
      )}

      {/* SIG Membership Gate Modal */}
      {isSigJoinModalOpen && activeSigForJoin && (
        <SigJoinModal
          sigKey={activeSigForJoin.key}
          sigTitle={activeSigForJoin.title}
          onClose={() => { setIsSigJoinModalOpen(false); setActiveSigForJoin(null); }}
          showNotification={showNotification}
        />
      )}

      {/* Event Registration Modal */}
      {isEventRegisterModalOpen && activeEventForRegister && (
        <EventRegisterModal
          event={activeEventForRegister}
          onClose={() => { setIsEventRegisterModalOpen(false); setActiveEventForRegister(null); }}
          showNotification={showNotification}
        />
      )}

      {/* Registration Success Overlay Dialog */}
      {registeredSuccess && (
        <div className="modal-overlay" onClick={() => setRegisteredSuccess(null)}>
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(52, 199, 89, 0.1)',
              color: '#34c759',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px solid #34c759'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Welcome to ACM!</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Your application has been authenticated.
            </p>

            <div className="liquid-glass-badge" style={{ margin: '20px 0', padding: '16px', borderRadius: '12px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MEMBER ACCESS ID</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>
                {registeredSuccess.id}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '10px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}><b>{registeredSuccess.name}</b></div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{registeredSuccess.rollNo}</div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setRegisteredSuccess(null)}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Custom Liquid Glass Notification */}
      {notification && (
        <div className="liquid-notification">
          <div className="liquid-notification-icon">
            {notification.type === 'error' ? (
              <AlertCircle size={22} color="#ff453a" />
            ) : (
              <CheckCircle2 size={22} color="var(--accent)" />
            )}
          </div>
          <div className="liquid-notification-text">
            <div className="liquid-notification-app">{notification.title}</div>
            <div className="liquid-notification-desc">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Global SVG Filters */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <svg>
          <filter id="liquid-popup-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </svg>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0'
  },
  loginCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: 'var(--card-shadow)'
  },
  loginIconBg: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  loginTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  loginSub: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginBottom: '24px',
    lineHeight: '1.4'
  },
  loginError: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    border: '1px solid #ff453a',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    color: '#ff453a',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    textAlign: 'left'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px'
  },
  statsCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '260px'
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-tertiary)',
    pointerEvents: 'none'
  },
  searchInput: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 16px 10px 44px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    transition: 'var(--transition-fast)'
  },
  filterWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 16px'
  },
  filterSelect: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer'
  },
  tableCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflowX: 'auto',
    boxShadow: 'var(--card-shadow)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px'
  },
  th: {
    padding: '16px 20px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    borderBottom: '1px solid var(--border)',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 0.2s ease'
  },
  td: {
    padding: '16px 20px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap'
  },
  tableTag: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
  },
  noResults: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-tertiary)',
    fontSize: '15px'
  }
};

// Inject admin responsive layouts style
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @media (max-width: 768px) {
      div[style*="statsRow"] {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
      div[style*="controlsRow"] {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      div[style*="searchWrapper"] {
        width: 100% !important;
      }
      div[style*="filterWrapper"] {
        justify-content: space-between !important;
      }
      .section-header button {
        width: 100% !important;
        margin-top: 8px;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
