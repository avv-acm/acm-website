import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, MapPin, Users } from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────── */
const MARQUEE_GIFS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
];
const MARQUEE_GIFS_2 = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const EVENTS = [
  {
    id: '01',
    title: 'ACM HackNight 2026',
    category: 'Hackathon',
    date: 'Aug 15, 2026',
    time: '6:00 PM – 6:00 PM+1',
    location: 'Lab Block, Amrita Nagercoil',
    seats: '80 Seats',
    img1: '/images/event_1.png',
    img2: '/images/sig_hero.png',
    img3: '/images/event_2.png',
  },
  {
    id: '02',
    title: 'AI Bootcamp: Gemini APIs',
    category: 'Workshop',
    date: 'Sep 10, 2026',
    time: '10:00 AM – 4:00 PM',
    location: 'Seminar Hall, Block C',
    seats: '60 Seats',
    img1: '/images/sig_ai.png',
    img2: '/images/event_1.png',
    img3: '/images/sig_hero.png',
  },
  {
    id: '03',
    title: 'Zero-Trust CTF Challenge',
    category: 'SIG Cybersecurity',
    date: 'Oct 5, 2026',
    time: '2:00 PM – 8:00 PM',
    location: 'Online + On-Campus',
    seats: '40 Seats',
    img1: '/images/sig_cyber.png',
    img2: '/images/sig_social.png',
    img3: '/images/event_2.png',
  },
];

const DEFAULT_FLIGHT_EVENTS = [
  {
    _id: "flight-1",
    bg: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    cityName: "Hacknight 2026",
    fareClass: "Premium Hackathon",
    priceVal: "₹0",
    airportCode: "ACM",
    buttonText: "Book Ticket",
    link: "/register",
    published: true,
    likesCount: 12
  },
  {
    _id: "flight-2",
    bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    cityName: "AI Dev Bootcamp",
    fareClass: "Gemini Edition",
    priceVal: "₹0",
    airportCode: "BLR",
    buttonText: "Claim Pass",
    link: "/register",
    published: true,
    likesCount: 24
  },
  {
    _id: "flight-3",
    bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    cityName: "CTF Hardening",
    fareClass: "Cyber Defense",
    priceVal: "₹0",
    airportCode: "ZTR",
    buttonText: "Deploy Mission",
    link: "/register",
    published: true,
    likesCount: 18
  }
];

/* ─── Marquee Section ───────────────────────────────────────── */
function MarqueeSection() {
  const ref = useRef(null);
  const [offset, setOffset] = useState(200);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const raw = (window.scrollY - sectionTop + window.innerHeight) * 0.28;
      setOffset(raw);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const row1 = [...MARQUEE_GIFS, ...MARQUEE_GIFS, ...MARQUEE_GIFS];
  const row2 = [...MARQUEE_GIFS_2, ...MARQUEE_GIFS_2, ...MARQUEE_GIFS_2];

  return (
    <div ref={ref} style={{ backgroundColor: 'var(--bg-primary)', padding: '80px 0 40px', overflow: 'hidden' }}>
      {[{ imgs: row1, dir: 1 }, { imgs: row2, dir: -1 }].map((row, ri) => (
        <div key={ri} style={{ marginBottom: ri === 0 ? '12px' : 0 }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            transform: `translateX(${row.dir * (offset - 200)}px)`,
            willChange: 'transform',
            transition: 'transform 0.05s linear',
          }}>
            {row.imgs.map((src, i) => (
              <img
                key={i} src={src} alt="" loading="lazy"
                style={{ width: 420, height: 270, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Stacking Event Cards ──────────────────────────────────── */
function EventCard({ event, index, total }) {
  const cardRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.bottom / window.innerHeight));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = 1 - (1 - targetScale) * scrollProgress;

  return (
    <div ref={cardRef} style={{
      height: '85vh', position: 'sticky', top: `${80 + index * 24}px`,
    }}>
      <div style={{
        width: '100%', height: '100%',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        willChange: 'transform',
        borderRadius: '48px',
        border: '1.5px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflow: 'hidden',
      }}>
        {/* Top Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span style={{ fontSize: 'clamp(40px, 7vw, 100px)', fontWeight: 900, color: 'var(--border-focus)', lineHeight: 1, opacity: 0.3 }}>
              {event.id}
            </span>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {event.category}
              </p>
              <h3 style={{ fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {event.title}
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { icon: <Calendar size={13} />, text: event.date },
              { icon: <Clock size={13} />, text: event.time },
              { icon: <MapPin size={13} />, text: event.location },
              { icon: <Users size={13} />, text: event.seats },
            ].map((tag, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '20px',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: '12px',
              }}>
                {tag.icon} {tag.text}
              </div>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '12px', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <img src={event.img1} alt="" style={{ width: '100%', flex: '0 0 auto', height: 'clamp(120px, 14vw, 200px)', objectFit: 'cover', borderRadius: '24px' }} />
            <img src={event.img2} alt="" style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'cover', borderRadius: '24px' }} />
          </div>
          <img src={event.img3} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{
            padding: '10px 24px', borderRadius: '30px',
            border: '1.5px solid var(--border-color)',
            backgroundColor: 'transparent', color: 'var(--text-primary)',
            fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Register <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('events');
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  const [flightEvents, setFlightEvents] = useState([]);
  const [likedCards, setLikedCards] = useState(() => {
    const saved = localStorage.getItem('acm_liked_flight_cards');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('acm_flight_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFlightEvents(parsed.filter((e) => e.published));
      } catch (e) {
        console.error(e);
        setFlightEvents(DEFAULT_FLIGHT_EVENTS);
      }
    } else {
      setFlightEvents(DEFAULT_FLIGHT_EVENTS);
    }
  }, []);

  const toggleLike = (cardId) => {
    const next = likedCards.includes(cardId)
      ? likedCards.filter((id) => id !== cardId)
      : [...likedCards, cardId];
    setLikedCards(next);
    localStorage.setItem('acm_liked_flight_cards', JSON.stringify(next));
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero shrink animation
  const scrollFraction = Math.min(1, Math.max(0, (scrollY - 50) / 550));
  const heroScale = 1 - 0.12 * scrollFraction;
  const heroBorderRadius = 52 * scrollFraction;

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, sans-serif", overflowX: 'clip'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .events-hide-scrollbar::-webkit-scrollbar { display: none; }
        .events-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .event-heading-gradient {
          background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .flight-cards-container {
          display: flex;
          overflow-x: auto;
          gap: 32px;
          padding: 40px 24px 60px;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .flight-cards-container::-webkit-scrollbar {
          display: none;
        }

        .flight-phone-frame {
          width: 320px;
          height: 640px;
          background: #161617;
          border-radius: 54px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          position: relative;
          flex: 0 0 auto;
          scroll-snap-align: center;
          box-shadow: 
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 4px 12px rgba(0,0,0,0.5),
            0 24px 48px -12px rgba(0, 0, 0, 0.7);
        }

        .flight-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 42px;
          overflow: hidden;
        }
        .flight-card img.flight-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Top scrim progressive blur */
        .flight-top-scrim-bg {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 100px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .flight-like-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease, background-color 0.2s ease;
          z-index: 3;
        }
        .flight-like-btn:active { transform: scale(0.9); }
        .flight-like-btn svg {
          width: 18px;
          height: 18px;
          stroke: white;
          fill: none;
          stroke-width: 2;
          transition: fill 0.15s ease, stroke 0.15s ease;
        }
        .flight-like-btn.liked svg {
          fill: #ff3b30;
          stroke: #ff3b30;
        }

        /* Bottom panel progressive blur (background layer) */
        .flight-bottom-panel-bg {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 240px;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 65%, transparent 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
        }

        /* Content layer on top of blur (no fade/mask) */
        .flight-bottom-panel-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 32px 20px 20px;
          z-index: 2;
          text-align: left;
        }

        .flight-city {
          color: #fff;
          font-size: 28px;
          font-weight: 600;
          line-height: 1.2;
        }
        .flight-fare-class {
          color: rgba(255,255,255,0.7);
          font-size: 15px;
          margin-top: 2px;
        }
        .flight-meta-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 16px 0 18px;
        }
        .flight-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-size: 14px;
        }
        .flight-meta-item svg {
          width: 15px;
          height: 15px;
          stroke: rgba(255,255,255,0.8);
          fill: none;
          stroke-width: 2;
          flex-shrink: 0;
        }
        .flight-meta-muted { color: rgba(255,255,255,0.7); }
        .flight-meta-bold { font-weight: 600; }
        .flight-search-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 999px;
          background: #fff;
          color: #111;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s ease, background-color 0.2s ease;
          font-family: inherit;
        }
        .flight-search-btn:hover {
          background: #e5e5ea;
        }
        .flight-search-btn:active { transform: scale(0.98); }
      `}} />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="page-transition-enter" style={{ flex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ height: '150vh', position: 'relative' }}>
          <div style={{
            position: 'sticky', top: 0, height: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', backgroundColor: '#0C0C0C',
          }}>
            <div style={{
              width: '100%', height: '100%',
              transform: `scale(${heroScale})`,
              borderRadius: `${heroBorderRadius}px`,
              overflow: 'hidden', position: 'relative',
              transition: 'transform 0.08s linear, border-radius 0.08s linear',
              willChange: 'transform, border-radius',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)', zIndex: 1 }} />
              <img src="/images/sig_hero.png" alt="Events Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '5% 6%' }}>
                <p style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#86868b', marginBottom: '12px' }}>
                  Amrita ACM · Events 2026
                </p>
                <h1 style={{
                  fontSize: 'clamp(48px, 9vw, 130px)', fontWeight: 900,
                  lineHeight: 0.95, letterSpacing: '-0.03em',
                  background: 'linear-gradient(180deg, #fff 0%, #86868b 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  marginBottom: '28px',
                }}>
                  Build.<br />Break.<br />Repeat.
                </h1>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    onClick={() => navigate('/register')}
                    style={{
                      padding: '14px 32px', borderRadius: '40px',
                      background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                      boxShadow: '0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1',
                      outline: '2px solid rgba(255,255,255,0.25)', outlineOffset: '-3px',
                      color: '#fff', fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                      border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    Register Now <ChevronRight size={16} />
                  </button>
                  <span style={{ color: '#86868b', fontSize: 'clamp(13px, 1.4vw, 16px)' }}>↓ Scroll to explore events</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <MarqueeSection />

        {/* ── INTRO COPY ── */}
        <section style={{ padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 80px)', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="event-heading-gradient" style={{
            fontSize: 'clamp(44px, 10vw, 140px)', fontWeight: 900,
            lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '48px',
          }}>
            Events
          </h2>
          <p style={{
            fontSize: 'clamp(17px, 2vw, 24px)', lineHeight: 1.65,
            color: '#86868b', fontWeight: 300, maxWidth: '680px', margin: '0 auto',
          }}>
            <span style={{ color: '#f5f5f7', fontWeight: 500 }}>Hackathons, workshops, SIGs.</span>{' '}
            Real-world challenges built by the community, for the community. Every event is designed to push boundaries, forge connections, and produce work that matters.
          </p>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1px',
          borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 'clamp(60px, 10vw, 120px)',
        }}>
          {[
            { value: '24hrs', label: 'Hacknight Duration' },
            { value: '100+', label: 'Participants Per Event' },
            { value: '3', label: 'SIG Tracks' },
            { value: '₹0', label: 'Entry Fee' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: '1 1 160px', padding: '36px 24px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#f5f5f7', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#86868b', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* ── STACKING EVENT CARDS ── */}
        <section style={{ padding: '0 clamp(12px, 3vw, 40px) clamp(60px, 10vw, 120px)' }}>
          {EVENTS.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} total={EVENTS.length} />
          ))}
        </section>

        {/* ── SPECIAL FLIGHT CARD EVENTS ── */}
        {flightEvents.length > 0 && (
          <section style={{
            padding: '80px clamp(12px, 3vw, 40px)',
            backgroundColor: '#0C0C0C',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <h2 className="event-heading-gradient" style={{
              fontSize: 'clamp(28px, 5vw, 64px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}>
              Choose Your Destination
            </h2>
            <p style={{
              fontSize: 'clamp(14px, 1.6vw, 18px)',
              color: '#86868b',
              marginBottom: '48px',
              maxWidth: '600px',
              margin: '0 auto 48px'
            }}>
              Claim your boarding passes for upcoming club journeys and high-octane tracks.
            </p>

            <div 
              className="flight-cards-container"
              style={{
                justifyContent: flightEvents.length <= 3 ? 'center' : 'flex-start'
              }}
            >
              {flightEvents.map((card) => {
                const isLiked = likedCards.includes(card._id);
                return (
                  <div key={card._id} className="flight-phone-frame">
                    <div className="flight-card">
                      <img className="flight-bg" src={card.bg} alt={card.cityName} />
                      <div className="flight-top-scrim-bg"></div>

                      <button
                        className={`flight-like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={() => toggleLike(card._id)}
                        aria-label="Save to favorites"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>

                      {/* Backdrop Blur Scrim Layer */}
                      <div className="flight-bottom-panel-bg"></div>

                      {/* Content Layer */}
                      <div className="flight-bottom-panel-content">
                        <div className="flight-city">{card.cityName}</div>
                        <div className="flight-fare-class">{card.fareClass}</div>

                        <div className="flight-meta-row">
                          <div className="flight-meta-item">
                            <svg viewBox="0 0 24 24">
                              <path d="M20.59 13.41L11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83z"/>
                              <circle cx="7.5" cy="7.5" r="1.5"/>
                            </svg>
                            <span className="flight-meta-muted">from</span>
                            <span className="flight-meta-bold">{card.priceVal}</span>
                          </div>
                          <div className="flight-meta-item">
                            <svg viewBox="0 0 24 24">
                              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.4.5c-.4.5-.3 1.2.2 1.5L9 12l-2 3H3l-1 2 4 1 1 4 2-1v-4l3-2 3.6 6.4c.3.5 1 .6 1.5.2l.5-.4c.4-.3.6-.8.5-1.3z"/>
                            </svg>
                            <span className="flight-meta-bold">{card.airportCode}</span>
                          </div>
                        </div>

                        <button
                          className="flight-search-btn"
                          onClick={() => {
                            if (card.link.startsWith('http')) {
                              window.open(card.link, '_blank');
                            } else {
                              navigate(card.link);
                            }
                          }}
                        >
                          {card.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── FINAL CTA ── */}
        <section style={{
          padding: 'clamp(80px, 12vw, 160px) 24px',
          textAlign: 'center', backgroundColor: '#0C0C0C',
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 80px)', fontWeight: 900,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: '#f5f5f7', marginBottom: '24px',
          }}>
            Ready to be part<br />of something real?
          </h2>
          <p style={{ fontSize: 'clamp(15px, 1.8vw, 20px)', color: '#86868b', marginBottom: '40px' }}>
            Join the Amrita ACM Chapter and get early access to all events.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: 'clamp(14px, 2vw, 20px) clamp(28px, 4vw, 56px)',
              borderRadius: '40px',
              background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
              boxShadow: '0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1',
              outline: '2px solid rgba(255,255,255,0.25)', outlineOffset: '-3px',
              color: '#fff', fontSize: 'clamp(14px, 1.5vw, 18px)', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', border: 'none',
            }}
          >
            Join the Chapter
          </button>
        </section>

      </main>

      <Footer />
    </div>
  );
}
