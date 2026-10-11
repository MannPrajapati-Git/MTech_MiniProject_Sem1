import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { MATERIAL_CATEGORIES, REFERENCE_RATES } from '../../utils/constants';
import { formatINR } from '../../utils/formatters';

const Home = () => {
  // Interactive Calculator State
  const [calcCategory, setCalcCategory] = useState('PCB Boards');
  const [calcWeight, setCalcWeight] = useState(75);

  const currentRate = REFERENCE_RATES[calcCategory] || 100;
  const estimatedCash = calcWeight * currentRate;
  const co2Saved = (calcWeight * 2.8).toFixed(1);
  const toxicMetalsDiverted = (calcWeight * 0.14).toFixed(1);

  // Category SVGs / Icons Mapping
  const categoryIcons = {
    'PCB Boards': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M6 6h4v4H6z" />
        <path d="M6 14h4v4H6z" />
        <path d="M14 6h4v4h-4z" />
        <path d="M14 14h4v4h-4z" />
        <line x1="10" y1="8" x2="14" y2="8" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <line x1="16" y1="10" x2="16" y2="14" />
      </svg>
    ),
    'Batteries (Li-ion/Lead)': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="16" height="12" rx="2" />
        <line x1="22" y1="11" x2="22" y2="15" />
        <line x1="6" y1="11" x2="6" y2="15" />
        <line x1="10" y1="11" x2="10" y2="15" />
      </svg>
    ),
    'Wires & Copper Cables': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h16" />
        <path d="M4 6h16" />
        <path d="M4 18h16" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="16" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    ),
    'Mobile Phones & Chargers': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    'Laptops & Computers': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    'Mixed E-Waste': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    'Screens & Displays': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-page)' }}>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section
        className="bg-ambient-glow"
        style={{
          padding: '5.5rem 0 5rem',
          borderBottom: '1px solid var(--color-border-default)',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div style={{ maxWidth: '640px' }}>
              {/* Shimmer Announcement Badge */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="shimmer-badge">
                  <span className="live-pulse-dot" />
                  <span>India&apos;s Formal E-Waste Exchange • SPCB Compliant</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
                  lineHeight: '1.15',
                  marginBottom: '1.35rem',
                  letterSpacing: '-0.03em',
                  fontWeight: 800
                }}
              >
                Turn Your E-Waste into{' '}
                <span className="gradient-text">Direct High-Value</span> Payouts
              </h1>

              {/* Sub-headline */}
              <p
                style={{
                  fontSize: '1.12rem',
                  lineHeight: '1.65',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2.25rem'
                }}
              >
                Connect informal kabadiwalas directly with authorized industrial recyclers.
                Eliminate greedy scrap middlemen, receive verified scale weigh-ins, and enjoy instant digital payouts with 100% legal traceability.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{
                    padding: '0.9rem 1.85rem',
                    fontSize: '1.02rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <span>Sell E-Waste as Collector</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <Link
                  to="/register"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.9rem 1.75rem',
                    fontSize: '1.02rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <span>Onboard as Recycler</span>
                </Link>
              </div>

              {/* Trust Metric Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.75rem',
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border-muted)',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--color-brand-600)', fontSize: '1.1rem' }}>✓</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Zero Middlemen Commission</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--color-brand-600)', fontSize: '1.1rem' }}>✓</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Scale-Verified Handover</span>
                </div>
              </div>
            </div>

            {/* Right Live Simulation Card (Glassmorphic) */}
            <div style={{ position: 'relative' }}>
              {/* Floating Glow Sphere Behind */}
              <div
                style={{
                  position: 'absolute',
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                  top: '-40px',
                  right: '-30px',
                  zIndex: 0,
                  filter: 'blur(30px)'
                }}
              />

              {/* Card Container */}
              <div
                className="glass-card"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '2.25rem',
                  backgroundColor: '#ffffff',
                  boxShadow: 'var(--shadow-xl)',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                {/* Header Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-brand-100)',
                        color: 'var(--color-brand-800)',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      LIVE LOT #KC-9042
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Posted 18m ago</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--color-brand-700)',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    <span className="live-pulse-dot" /> 3 Bids Live
                  </span>
                </div>

                {/* Lot Title & Weight */}
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Grade-A Mixed PCB Motherboards
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  📍 Industrial Area, New Delhi • Segregated & Moisture-Free
                </p>

                {/* Grid Details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    padding: '1.1rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--color-border-muted)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Estimated Lot Weight</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>450 KG</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>CPCB Baseline Rate</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>₹150 / kg</span>
                  </div>
                </div>

                {/* Top Recycler Bid Box */}
                <div
                  style={{
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                    border: '1.5px solid var(--color-brand-300)',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-brand-900)' }}>
                      Highest Recycler Quotation
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', backgroundColor: '#a7f3d0', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      +14.6% vs Local Scrap
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-800)' }}>₹172</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}> / kg</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Estimated Payout</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-brand-900)' }}>₹77,400</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Bidder:</span> <strong>EcoGreen Processors Pvt Ltd</strong> <span>(SPCB Verified)</span>
                  </div>
                </div>

                {/* Interactive Demo Action */}
                <Link
                  to="/price-board"
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '0.92rem' }}
                >
                  Check Real-Time Market Rates for Your Materials →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORM METRICS SHOWCASE ================= */}
      <section style={{ padding: '3.75rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-border-default)' }}>
        <div className="container">
          <div className="grid-4">
            <div className="card" style={{ textAlign: 'center', padding: '1.8rem 1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-brand-700)', letterSpacing: '-0.03em' }}>
                38,500+ <span style={{ fontSize: '1.2rem' }}>KG</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0 0.2rem' }}>E-Waste Safely Recycled</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Kept out of illegal open dumps</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.8rem 1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-brand-700)', letterSpacing: '-0.03em' }}>
                ₹45.2 <span style={{ fontSize: '1.2rem' }}>LAKHS</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0 0.2rem' }}>Paid to Local Collectors</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Transparent fair market settlement</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.8rem 1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-brand-700)', letterSpacing: '-0.03em' }}>
                50+ <span style={{ fontSize: '1.2rem' }}>CENTERS</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0 0.2rem' }}>Authorized Recyclers</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Verified SPCB & CPCB facilities</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.8rem 1.25rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-brand-700)', letterSpacing: '-0.03em' }}>
                100%
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.35rem 0 0.2rem' }}>Digital Traceability</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Zero paperwork & dispute-free</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE ESTIMATION CALCULATOR ================= */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border-default)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--color-brand-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.4rem',
                display: 'block'
              }}
            >
              Interactive Profit Estimator
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Calculate Your Direct Lot Value & Green Impact
            </h2>
            <p style={{ fontSize: '1.02rem', color: 'var(--color-text-secondary)' }}>
              See in real time how much more you earn compared to unorganized middlemen scrap rates.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {/* Controls */}
              <div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.95rem' }}>
                    1. Select Scrap Electronic Component
                  </label>
                  <select
                    className="form-select"
                    value={calcCategory}
                    onChange={(e) => setCalcCategory(e.target.value)}
                    style={{ fontSize: '1rem', fontWeight: 600 }}
                  >
                    {MATERIAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} (Benchmark: {formatINR(REFERENCE_RATES[cat])}/kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginTop: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label" style={{ fontSize: '0.95rem', margin: 0 }}>
                      2. Estimated Lot Weight
                    </label>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
                      {calcWeight} KG
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--color-brand-600)',
                      cursor: 'pointer',
                      height: '8px'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    <span>5 kg</span>
                    <span>150 kg</span>
                    <span>300 kg</span>
                    <span>500 kg</span>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <Link to="/register" className="btn btn-primary" style={{ width: '100%', fontSize: '0.95rem' }}>
                    List This {calcCategory} Lot Free →
                  </Link>
                </div>
              </div>

              {/* Live Impact Results Card */}
              <div
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Estimated Payout Value
                  </span>
                  <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0 0.5rem', letterSpacing: '-0.02em' }}>
                    {formatINR(estimatedCash)}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#d1fae5' }}>
                    *Based on ₹{currentRate}/kg reference. Recycler quotes can be higher for verified lots.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#a7f3d0', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
                    🌱 Environmental & Health Impact:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{co2Saved} kg</span>
                      <span style={{ fontSize: '0.75rem', color: '#d1fae5', display: 'block' }}>CO2e Prevented</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{toxicMetalsDiverted} kg</span>
                      <span style={{ fontSize: '0.75rem', color: '#d1fae5', display: 'block' }}>Heavy Metals Neutralized</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MATERIAL CATEGORIES SNAPSHOT ================= */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--color-border-default)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-brand-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                High-Value Components
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.2rem 0' }}>
                Segregated E-Waste Categories
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                Government standard baseline rates to ensure local informal workers are never cheated.
              </p>
            </div>
            <Link to="/price-board" className="btn btn-outline">
              Open Full Price Board Ticker →
            </Link>
          </div>

          <div className="grid-3">
            {MATERIAL_CATEGORIES.slice(0, 6).map((cat) => (
              <div
                key={cat}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--color-brand-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {categoryIcons[cat]}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-brand-100)',
                        color: 'var(--color-brand-800)'
                      }}
                    >
                      High Demand
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem' }}>{cat}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                    Segregated scrap boards, components, and intact recovery items.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border-muted)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Benchmark Rate</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
                      {formatINR(REFERENCE_RATES[cat])}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}> / kg</span>
                  </div>
                  <Link
                    to="/register"
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', minHeight: '38px' }}
                  >
                    Sell Lot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRADITIONAL VS KABADIWALA CONNECT ================= */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-border-default)' }}>
        <div className="container" style={{ maxWidth: '1050px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-brand-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Why Switch to Digital
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.2rem 0' }}>
              Traditional Scrap Dealer vs. Kabadiwala Connect
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              How formal market access protects informal waste collectors from unfair exploitation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Traditional Card */}
            <div
              className="card"
              style={{
                borderColor: '#fecaca',
                backgroundColor: '#fffcfc',
                padding: '2.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.4rem' }}>❌</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                  Traditional Local Scrap Yards
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#475569' }}>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>
                  <span><strong>Arbitrary Pricing:</strong> Dealers dictate take-it-or-leave-it rates far below industrial value.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>
                  <span><strong>Mechanical Scale Manipulation:</strong> High risk of underweighing during manual sorting.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>
                  <span><strong>No Legal Receipts:</strong> Cash handovers with zero proof of transaction or dispute recourse.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>
                  <span><strong>Hazardous Acid Burning:</strong> Encourages dangerous unscientific dismantling in slums.</span>
                </li>
              </ul>
            </div>

            {/* Kabadiwala Connect Card */}
            <div
              className="card"
              style={{
                borderColor: 'var(--color-brand-400)',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-brand-glow)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.4rem' }}>✅</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand-800)', margin: 0 }}>
                  Kabadiwala Connect Platform
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#172018' }}>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                  <span><strong>Competitive Direct Bids:</strong> Certified recyclers compete for your lot, driving prices up 15-30%.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                  <span><strong>Scale-Verified Weighment:</strong> Recorded on site with dual party acknowledgment.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                  <span><strong>Traceable Digital Receipts:</strong> Unique receipt IDs stored securely in the platform ledger.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                  <span><strong>SPCB Authorized Facilities:</strong> Formal hydrometallurgical recycling without air/water pollution.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border-default)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-brand-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              The 4-Step Journey
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.2rem 0' }}>
              How The Closed-Loop Exchange Works
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              From informal scrap collection to guaranteed industrial payout
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(16, 185, 129, 0.25)', marginBottom: '0.5rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>List Material Lot</h3>
              <p style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
                Collector inputs estimated weight, selects component category, and enters pickup location. Takes under 60 seconds.
              </p>
            </div>

            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(16, 185, 129, 0.25)', marginBottom: '0.5rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Receive Live Quotes</h3>
              <p style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
                Verified recyclers across the region review your material and submit competitive per-KG price offers.
              </p>
            </div>

            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(16, 185, 129, 0.25)', marginBottom: '0.5rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Verified Scale Pickup</h3>
              <p style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
                Collector accepts the best offer. Recycler arrives for pickup and confirms physical weight transparently.
              </p>
            </div>

            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(16, 185, 129, 0.25)', marginBottom: '0.5rem' }}>
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Instant Receipt & Cash</h3>
              <p style={{ fontSize: '0.86rem', lineHeight: '1.6' }}>
                Final transaction payout is settled immediately and stored with a downloadable unique digital receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section style={{ padding: '5.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              padding: '3.75rem 2.5rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  letterSpacing: '0.04em'
                }}
              >
                ⚡ Join 1,500+ Waste Collectors Across India
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Ready to Get Top Value for Your E-Waste Lots?
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: '1.6', marginBottom: '2.25rem' }}>
                Join today. No registration fees, transparent digital weighment, and zero middlemen commissions.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/register"
                  className="btn"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#065f46',
                    padding: '0.85rem 1.85rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  Create Free Collector Account
                </Link>
                <Link
                  to="/price-board"
                  className="btn"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    padding: '0.85rem 1.6rem',
                    fontSize: '1rem'
                  }}
                >
                  View Market Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;