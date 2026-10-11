import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { MATERIAL_CATEGORIES, REFERENCE_RATES } from '../../utils/constants';
import { formatINR } from '../../utils/formatters';

// Scroll-triggered fade-in component
const FadeInSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const [calcCategory, setCalcCategory] = useState('PCB Boards');
  const [calcWeight, setCalcWeight] = useState(75);

  const currentRate = REFERENCE_RATES[calcCategory] || 100;
  const estimatedCash = calcWeight * currentRate;
  const co2Saved = (calcWeight * 2.8).toFixed(1);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section style={{ padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(var(--gray-200) 1px, transparent 1px)',
          backgroundSize: '24px 24px', opacity: 0.4, zIndex: 0
        }} />
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-200px', right: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.08), transparent 70%)',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center'
          }}>
            {/* Left Content */}
            <div>
              <FadeInSection>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)',
                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-700)'
                  }}>
                    <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
                    India&apos;s Formal E-Waste Exchange
                  </span>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.1}>
                <h1 style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.15,
                  fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem',
                  color: 'var(--text-primary)'
                }}>
                  Turn E-Waste Into <span style={{ color: 'var(--primary-600)' }}>Direct Payouts</span>
                </h1>
              </FadeInSection>

              <FadeInSection delay={0.2}>
                <p style={{
                  fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--text-secondary)',
                  marginBottom: '2rem', maxWidth: '520px'
                }}>
                  Connect local kabadiwalas directly with authorized recyclers. No middlemen, 
                  verified weighments, and instant digital receipts.
                </p>
              </FadeInSection>

              <FadeInSection delay={0.3}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
                    Start Selling
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link to="/price-board" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
                    View Market Rates
                  </Link>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.4}>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {[
                    { num: '38,500+', label: 'KG Recycled' },
                    { num: '₹45L+', label: 'Paid Out' },
                    { num: '50+', label: 'Recyclers' }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        {stat.num}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </FadeInSection>
            </div>

            {/* Right — Hero Image */}
            <FadeInSection delay={0.2}>
              <div className="hero-image-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src="/images/hero-illustration.jpg"
                  alt="E-waste recycling illustration"
                  style={{
                    width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-2xl)',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                />
              </div>
            </FadeInSection>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
            .hero-image-wrapper { order: -1; }
          }
        `}</style>
      </section>

      {/* ===== TRUSTED BY STRIP ===== */}
      <section style={{ padding: '2rem 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--surface-muted)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <span>Trusted by</span>
            {['CPCB Verified', 'SPCB Compliant', 'ISO 14001', 'Zero Landfill'].map((badge) => (
              <span key={badge} style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem',
                backgroundColor: '#ffffff', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)',
                fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-secondary)'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '560px', margin: '0 auto 3rem' }}>
              <span className="section-label">How It Works</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Simple 4-Step Process
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                From informal scrap collection to guaranteed industrial payouts — all within the platform.
              </p>
            </div>
          </FadeInSection>

          <div className="grid-4" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {[
              {
                step: '01', title: 'List Materials',
                desc: 'Enter estimated weight, select category, and add your pickup location.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                )
              },
              {
                step: '02', title: 'Receive Bids',
                desc: 'Certified recyclers review and submit competitive per-KG price offers.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                )
              },
              {
                step: '03', title: 'Verified Pickup',
                desc: 'Accept the best offer. Recycler arrives and confirms weight on site.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                )
              },
              {
                step: '04', title: 'Get Paid',
                desc: 'Instant digital receipt and payout settlement — zero paperwork.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <FadeInSection key={item.step} delay={idx * 0.1}>
                <div style={{
                  padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-default)', backgroundColor: '#ffffff',
                  transition: 'all 0.25s ease', cursor: 'default', height: '100%'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-300)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--primary-50)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary-500)', marginBottom: '0.375rem', letterSpacing: '0.03em' }}>
                    STEP {item.step}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE CALCULATOR ===== */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--surface-muted)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="section-label">Profit Estimator</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Calculate Your Lot Value
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                See how much more you earn compared to local scrap dealers.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
              backgroundColor: '#ffffff', borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)', overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }} className="calc-grid">
              {/* Controls */}
              <div style={{ padding: '2rem' }}>
                <div className="form-group">
                  <label className="form-label">Material Category</label>
                  <select
                    className="form-select"
                    value={calcCategory}
                    onChange={(e) => setCalcCategory(e.target.value)}
                    style={{ fontWeight: 500 }}
                  >
                    {MATERIAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} — {formatINR(REFERENCE_RATES[cat])}/kg
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0 }}>Estimated Weight</label>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                      {calcWeight} KG
                    </span>
                  </div>
                  <input
                    type="range" min="5" max="500" step="5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary-600)', cursor: 'pointer', marginTop: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    <span>5 kg</span><span>250 kg</span><span>500 kg</span>
                  </div>
                </div>

                <Link to="/register" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                  List This Lot Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {/* Results */}
              <div style={{
                padding: '2rem', backgroundColor: 'var(--gray-900)', color: '#ffffff',
                display: 'flex', flexDirection: 'column', justifyContent: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  Estimated Payout
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                  {formatINR(estimatedCash)}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
                  Based on {formatINR(currentRate)}/kg reference rate
                </p>

                <div style={{ borderTop: '1px solid var(--gray-700)', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--primary-400)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Environmental Impact
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{co2Saved} kg</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>CO₂ Prevented</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{(calcWeight * 0.14).toFixed(1)} kg</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>Toxins Neutralized</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .calc-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ===== MATERIAL CATEGORIES ===== */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <FadeInSection>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div>
                <span className="section-label">E-Waste Categories</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>
                  High-Value Components
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                  Government benchmark rates to ensure fair pricing for all collectors.
                </p>
              </div>
              <Link to="/price-board" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
                View All Rates
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </FadeInSection>

          <div className="grid-3">
            {MATERIAL_CATEGORIES.slice(0, 6).map((cat, idx) => (
              <FadeInSection key={cat} delay={idx * 0.08}>
                <div
                  style={{
                    padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-default)', backgroundColor: '#ffffff',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'all 0.25s ease', height: '100%'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-300)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="2" />
                        <path d="M6 6h4v4H6zM14 6h4v4h-4zM6 14h4v4H6zM14 14h4v4h-4z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>{cat}</h3>
                    <span style={{
                      display: 'inline-block', fontSize: '0.6875rem', fontWeight: 600,
                      color: 'var(--primary-700)', backgroundColor: 'var(--primary-50)',
                      padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)',
                      marginBottom: '0.75rem'
                    }}>
                      High Demand
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Benchmark</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                        {formatINR(REFERENCE_RATES[cat])}
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}> /kg</span>
                      </div>
                    </div>
                    <Link to="/register" className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', minHeight: '32px' }}>
                      Sell
                    </Link>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--surface-muted)' }}>
        <div className="container">
          <div className="why-us-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <FadeInSection>
              <img
                src="/images/about-illustration.jpg"
                alt="Digital marketplace illustration"
                style={{
                  width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
            </FadeInSection>

            <div>
              <FadeInSection>
                <span className="section-label">Why Kabadiwala Connect</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  Fair Prices, Zero Middlemen
                </h2>
              </FadeInSection>

              {[
                { title: 'Competitive Direct Bids', desc: 'Certified recyclers compete for your lot, driving prices up 15-30% vs local dealers.' },
                { title: 'Scale-Verified Weighment', desc: 'Recorded on-site with dual party acknowledgment — no cheating.' },
                { title: 'Digital Receipts', desc: 'Unique receipt IDs stored securely for complete traceability.' },
                { title: 'SPCB Authorized Facilities', desc: 'Only certified hydrometallurgical recycling — zero air/water pollution.' }
              ].map((item, idx) => (
                <FadeInSection key={item.title} delay={idx * 0.1}>
                  <div style={{
                    display: 'flex', gap: '0.875rem', marginBottom: '1.25rem',
                    padding: '1rem', borderRadius: 'var(--radius-lg)',
                    backgroundColor: '#ffffff', border: '1px solid var(--border-default)',
                    transition: 'all 0.2s ease'
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-300)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      backgroundColor: 'var(--primary-50)', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.125rem'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .why-us-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          }
        `}</style>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <FadeInSection>
            <div style={{
              padding: '3rem 2rem', borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--gray-900)', color: '#ffffff', textAlign: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Decorative circle */}
              <div style={{
                position: 'absolute', top: '-60px', right: '-40px',
                width: '200px', height: '200px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15), transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', bottom: '-80px', left: '-40px',
                width: '250px', height: '250px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                  Ready to Get Top Value?
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--gray-400)', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Join 1,500+ waste collectors across India. No registration fees, transparent pricing, zero middlemen.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    to="/register"
                    className="btn"
                    style={{
                      backgroundColor: '#ffffff', color: 'var(--gray-900)',
                      padding: '0.75rem 1.5rem', fontSize: '0.9375rem', fontWeight: 700,
                      borderRadius: 'var(--radius-md)', border: 'none'
                    }}
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/price-board"
                    className="btn"
                    style={{
                      backgroundColor: 'transparent', color: '#ffffff',
                      border: '1px solid var(--gray-600)',
                      padding: '0.75rem 1.5rem', fontSize: '0.9375rem'
                    }}
                  >
                    View Rates
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;