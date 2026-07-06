import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocalNavbar from '../components/LocalNavbar';
import { ScrambleIn, ScrambleHover } from '../components/ScrambleText';
import { ChevronRight, ArrowUpRight, Cpu, Shield, Share2 } from 'lucide-react';

/* ── Scroll-driven fade-in hook ── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); if (opts.once !== false) obs.disconnect(); } }, { threshold: opts.threshold || 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Video section URLs ── */
const VIDEOS = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4',
  cinematic: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4',
  metrics: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4',
  tech: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4',
  footer: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4',
};

/* ── SIG data ── */
const SIGS = [
  { id: 'ai', icon: Cpu, accent: '#0071e3', label: 'AI & Automations', tag: 'SIG-AI', img: '/images/sig_ai.png', headline: 'Intelligence that\nredefines possible.', desc: 'Deep learning models, NLP, Gemini APIs, autonomous agents, and agentic workflows — all in one collaborative lab.', features: ['Neural Networks', 'LLM Fine-tuning', 'Agentic Systems', 'Computer Vision'] },
  { id: 'cyber', icon: Shield, accent: '#30d158', label: 'Cybersecurity', tag: 'SIG-Cyber', img: '/images/sig_cyber.png', headline: 'Zero trust.\nInfinite security.', desc: 'Security architectures, vulnerability research, cryptographic protocols, and penetration testing frameworks.', features: ['Threat Modeling', 'Pen Testing', 'Cryptography', 'OSINT'] },
  { id: 'social', icon: Share2, accent: '#ff375f', label: 'Social Media', tag: 'SIG-Social', img: '/images/sig_social.png', headline: 'Connect. Create.\nEngage.', desc: 'Digital marketing, content strategy, brand architecture, and community-driven storytelling at scale.', features: ['Brand Strategy', 'Content Design', 'Analytics', 'Community Ops'] },
];

const METRICS = [
  { value: '200+', label: 'Active Members' },
  { value: '15+', label: 'Major Events' },
  { value: '4', label: 'Active SIGs' },
];

export default function SigPage() {
  const [activeTab, setActiveTab] = useState('sig');
  const [heroReady, setHeroReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroVideoRef = useRef(null);
  const navigate = useNavigate();

  /* Entrance delay */
  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 800); return () => clearTimeout(t); }, []);

  /* Scroll tracking */
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  /* Mouse-scrub hero video */
  const handleMouseMove = useCallback((e) => {
    const vid = heroVideoRef.current;
    if (!vid || !vid.duration) return;
    const pct = e.clientX / window.innerWidth;
    vid.currentTime = Math.max(0, Math.min(vid.duration, pct * vid.duration));
  }, []);

  const localNavLinks = [
    { label: 'Overview', to: '#overview', active: true },
    { label: 'AI & ML', to: '#ai' },
    { label: 'Cybersecurity', to: '#cyber' },
    { label: 'Social Media', to: '#social' },
  ];

  /* Cinematic section parallax */
  const cinematicProgress = Math.min(1, Math.max(0, (scrollY - window.innerHeight * 0.5) / (window.innerHeight * 0.8)));
  const rotateX = 24 - cinematicProgress * 24;
  const transY = 60 - cinematicProgress * 180;
  const textOpacity = Math.min(1, Math.max(0, (cinematicProgress - 0.15) / 0.35));

  /* inView hooks for sections */
  const [metricsRef, metricsVisible] = useInView({ threshold: 0.2 });
  const [techRef, techVisible] = useInView({ threshold: 0.15 });
  const [ctaRef, ctaVisible] = useInView({ threshold: 0.3 });

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <LocalNavbar title="Special Interest Groups" links={localNavLinks} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Anton+SC&display=swap');

        .sig-font-mono { font-family: 'Space Mono', 'SF Mono', monospace !important; }

        @keyframes sig-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sig-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .sig-fade-up { animation: sig-fade-up 0.8s cubic-bezier(0.25,1,0.5,1) forwards; opacity: 0; }
        .sig-fade-up-d1 { animation: sig-fade-up 0.8s cubic-bezier(0.25,1,0.5,1) 0.2s forwards; opacity: 0; }
        .sig-fade-up-d2 { animation: sig-fade-up 0.8s cubic-bezier(0.25,1,0.5,1) 0.4s forwards; opacity: 0; }
        .sig-fade-up-d3 { animation: sig-fade-up 0.8s cubic-bezier(0.25,1,0.5,1) 0.6s forwards; opacity: 0; }
        .sig-fade-up-d4 { animation: sig-fade-up 0.8s cubic-bezier(0.25,1,0.5,1) 0.8s forwards; opacity: 0; }
        .sig-fade-in { animation: sig-fade-in 1s ease-out forwards; opacity: 0; }

        .sig-video-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0;
          filter: var(--video-filter, none);
        }
        :root.light .sig-video-bg {
          --video-filter: invert(1) hue-rotate(180deg);
        }

        .liquid-glass {
          background: rgba(255,255,255,0.02);
          background-blend-mode: luminosity;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
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
        :root.light .liquid-glass {
          background: rgba(0,0,0,0.02);
          box-shadow: inset 0 1px 1px rgba(0,0,0,0.1);
        }
        :root.light .liquid-glass::before {
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 20%, transparent 40%, transparent 60%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0.2) 100%);
        }

        .sig-dot-grid {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 24px 24px; opacity: 0.05;
        }
        .sig-watermark {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Anton SC', sans-serif; text-transform: uppercase;
          font-size: clamp(80px, 20vw, 360px); letter-spacing: -4px;
          opacity: 0.08; pointer-events: none; z-index: 1; white-space: nowrap;
          background: radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sig-gradient-top {
          position: absolute; top: 0; left: 0; right: 0; height: 180px;
          background: linear-gradient(to bottom, #000 0%, transparent 100%);
          z-index: 2; pointer-events: none;
        }

        .sig-card-hover {
          transition: transform 0.4s cubic-bezier(0.25,1,0.5,1), box-shadow 0.4s ease;
        }
        .sig-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 32px 64px rgba(0,0,0,0.6);
        }

        .sig-layer-card {
          max-width: 480px; width: 100%; height: 72px;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; box-sizing: border-box;
          transition: border-color 0.3s, background 0.3s;
        }
        .sig-layer-card:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.03);
        }

        @media (max-width: 768px) {
          .sig-hero-bottom { flex-direction: column !important; gap: 24px !important; }
          .sig-hero-right { text-align: left !important; }
          .sig-grid-features { grid-template-columns: 1fr 1fr !important; }
          .sig-tech-top { flex-direction: column !important; }
          .sig-tech-right { text-align: left !important; max-width: 100% !important; }
          .sig-sig-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      <main className="page-transition-enter" style={{ flex: 1 }}>

        {/* ═══ SECTION 1: HERO ═══ */}
        <section id="overview" onMouseMove={handleMouseMove} style={{
          height: '100vh', display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden', cursor: 'crosshair'
        }}>
          <video ref={heroVideoRef} muted playsInline preload="auto" src={VIDEOS.hero} className="sig-video-bg" style={{ opacity: 0.6 }} />
          <div className="sig-dot-grid" />
          <div className="sig-watermark">INNOVATION</div>

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: '80px 24px 48px', position: 'relative', zIndex: 5,
            opacity: heroReady ? 1 : 0, transition: 'opacity 1s ease'
          }}>
            <div className="sig-hero-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h1 className="sig-font-mono" style={{
                  fontSize: 'clamp(40px, 10vw, 100px)', fontWeight: 300,
                  lineHeight: 0.95, letterSpacing: '-0.03em', color: 'var(--text-primary)'
                }}>
                  <ScrambleIn text="Explore" delay={200} triggered={heroReady} /><br />
                  <ScrambleIn text="Our SIGs" delay={500} triggered={heroReady} />
                </h1>
                <p className={heroReady ? 'sig-fade-up-d2' : ''} style={{
                  maxWidth: '380px', fontSize: '15px', color: 'var(--text-secondary)',
                  lineHeight: 1.6, fontFamily: 'Inter, sans-serif'
                }}>
                  Three dedicated verticals of research, building, and community. Each Special Interest Group is a launchpad for deep specialization.
                </p>
              </div>
              <div className="sig-hero-right" style={{ textAlign: 'right' }}>
                <h1 className="sig-font-mono" style={{
                  fontSize: 'clamp(40px, 10vw, 100px)', fontWeight: 300,
                  lineHeight: 0.95, letterSpacing: '-0.03em', color: 'var(--text-primary)'
                }}>
                  <ScrambleIn text="Build" delay={700} triggered={heroReady} /><br />
                  <ScrambleIn text="Together" delay={1000} triggered={heroReady} />
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: CINEMATIC TEXT ═══ */}
        <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video autoPlay muted loop playsInline src={VIDEOS.cinematic} className="sig-video-bg" style={{ opacity: 0.5 }} />
          <div className="sig-gradient-top" />
          <div style={{
            position: 'relative', zIndex: 5, maxWidth: '960px', padding: '0 24px',
            perspective: '400px', textAlign: 'center'
          }}>
            <p className="sig-font-mono" style={{
              fontSize: 'clamp(22px, 4vw, 42px)', color: 'var(--text-primary)', lineHeight: 1.35,
              letterSpacing: '-0.02em', fontWeight: 400,
              transform: `rotateX(${rotateX}deg) translateY(${transY}px) translateZ(15px)`,
              opacity: textOpacity, transition: 'transform 0.1s linear, opacity 0.1s linear'
            }}>
              A student chapter built on the architecture of collaborative innovation. ACM Amrita translates curiosity into computational expertise. Every project becomes measurable, structured, and impactful.
            </p>
          </div>
        </section>

        {/* ═══ SECTION 3: METRICS ═══ */}
        <section ref={metricsRef} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 24px' }}>
          <video autoPlay muted loop playsInline src={VIDEOS.metrics} className="sig-video-bg" style={{ opacity: 0.35 }} />
          <div style={{ position: 'relative', zIndex: 5, maxWidth: '1100px', width: '100%', textAlign: 'center' }}>
            <p className="sig-font-mono" style={{
              color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '80px',
              opacity: metricsVisible ? 1 : 0, transform: metricsVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1.2s cubic-bezier(0.25,1,0.5,1)'
            }}>
              Chapter Performance
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '48px' }}>
              {METRICS.map((m, i) => (
                <div key={m.label} style={{
                  opacity: metricsVisible ? 1 : 0,
                  transform: metricsVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.8s cubic-bezier(0.25,1,0.5,1) ${i * 0.15}s`
                }}>
                  <div style={{ fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: 300, letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>{m.value}</div>
                  <div className="sig-font-mono" style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 4: SIG CARDS ═══ */}
        {SIGS.map((sig, idx) => {
          const [cardRef, cardVis] = useInView({ threshold: 0.15 });
          return (
            <section key={sig.id} id={sig.id} ref={cardRef} style={{
              minHeight: '100vh', position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              padding: idx === 0 ? '0 24px 80px' : '80px 24px'
            }}>
              {idx === 0 && <video autoPlay muted loop playsInline src={VIDEOS.tech} className="sig-video-bg" style={{ opacity: 0.25 }} />}
              <div style={{ position: 'relative', zIndex: 5, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                {/* Top heading */}
                <div className="sig-tech-top" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', marginBottom: '60px',
                  opacity: cardVis ? 1 : 0, transform: cardVis ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'all 1s cubic-bezier(0.25,1,0.5,1)'
                }}>
                  <div>
                    <p className="sig-font-mono" style={{ color: sig.accent, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>{sig.tag}</p>
                    <h2 className="sig-font-mono" style={{
                      fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300,
                      lineHeight: 0.95, letterSpacing: '-0.03em', color: 'var(--text-primary)', whiteSpace: 'pre-line'
                    }}>{sig.headline}</h2>
                  </div>
                  <p className="sig-tech-right" style={{
                    color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6,
                    maxWidth: '320px', textAlign: 'right', paddingTop: '8px',
                    fontFamily: 'Inter, sans-serif',
                    opacity: cardVis ? 1 : 0, transform: cardVis ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 1s cubic-bezier(0.25,1,0.5,1) 0.2s'
                  }}>{sig.desc}</p>
                </div>

                {/* Image + Features */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center',
                  opacity: cardVis ? 1 : 0, transition: 'opacity 1s ease 0.3s'
                }} className="sig-sig-grid">
                  <div style={{
                    borderRadius: '24px', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
                    aspectRatio: '4/3'
                  }} className="sig-card-hover liquid-glass">
                    <img src={sig.img} alt={sig.label} style={{ width: '100%', maxWidth: '360px', objectFit: 'contain', filter: `drop-shadow(0 20px 40px ${sig.accent}40)` }} />
                  </div>
                  <div className="sig-grid-features" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {sig.features.map((feat, fi) => (
                      <div key={feat} className="sig-card-hover liquid-glass" style={{
                        borderRadius: '16px', padding: '24px',
                        opacity: cardVis ? 1 : 0, transform: cardVis ? 'translateY(0)' : 'translateY(20px)',
                        transition: `all 0.7s cubic-bezier(0.25,1,0.5,1) ${0.3 + fi * 0.1}s`
                      }}>
                        <sig.icon size={20} color={sig.accent} style={{ marginBottom: '12px', opacity: 0.7 }} />
                        <h4 className="sig-font-mono" style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 400 }}>{feat}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {idx < SIGS.length - 1 && (
                <div style={{ maxWidth: '1200px', margin: '80px auto 0', width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              )}
            </section>
          );
        })}

        {/* ═══ SECTION 5: ARCHITECTURE ═══ */}
        {(() => {
          const [archRef, archVis] = useInView({ threshold: 0.3 });
          return (
            <section ref={archRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '128px 24px', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ maxWidth: '720px', textAlign: 'center', width: '100%' }}>
                <div style={{ opacity: archVis ? 1 : 0, transform: archVis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s cubic-bezier(0.25,1,0.5,1)' }}>
                  <p className="sig-font-mono" style={{ color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '32px' }}>Our Architecture</p>
                  <h2 className="sig-font-mono" style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '40px' }}>
                    Three pillars. Zero boundaries.
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
                    Research layer drives exploration. Build layer transforms ideas into deployable systems. Community layer connects minds across disciplines.
                  </p>
                </div>
                <div style={{
                  marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                  opacity: archVis ? 1 : 0, transition: 'opacity 1.2s ease 0.4s'
                }}>
                  {['Research', 'Build', 'Community'].map((layer, i) => (
                    <div key={layer} className="sig-layer-card liquid-glass" style={{
                      opacity: archVis ? 1 : 0, transform: archVis ? 'translateY(0)' : 'translateY(15px)',
                      transition: `all 0.6s cubic-bezier(0.25,1,0.5,1) ${0.5 + i * 0.12}s`,
                      border: 'none'
                    }}>
                      <span className="sig-font-mono" style={{ color: 'var(--text-tertiary)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Layer {i + 1}</span>
                      <span className="sig-font-mono" style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 300 }}>{layer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* ═══ SECTION 6: CTA ═══ */}
        <section ref={ctaRef} style={{ padding: '0 22px 100px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px' }}>
            <video autoPlay muted loop playsInline src={VIDEOS.footer} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
            <div style={{
              position: 'relative', zIndex: 5, padding: '80px 40px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.25,1,0.5,1)'
            }}>
              <h2 className="sig-font-mono" style={{ fontSize: '32px', fontWeight: 300, marginBottom: '16px', letterSpacing: '-0.01em', textAlign: 'center', color: '#fff' }}>
                Ready to dive in?
              </h2>
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', textAlign: 'center', maxWidth: '500px', fontFamily: 'Inter, sans-serif' }}>
                Join a Special Interest Group today and get access to exclusive workshops, events, and resources.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="sig-card-hover"
                style={{
                  backgroundColor: '#fff', color: '#000', border: 'none',
                  padding: '16px 32px', borderRadius: '30px', fontSize: '15px',
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Register Now <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
