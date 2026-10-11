import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { MATERIAL_CATEGORIES, REFERENCE_RATES } from '../../utils/constants';
import { formatINR } from '../../utils/formatters';

const categoryDetails = {
  'PCB Boards': {
    trend: '+6.2%',
    trendUp: true,
    qualityBasis: 'Grade-A Green Gold/Silver Finger Telecom & Server Boards',
    demand: 'High Global Smelter Demand'
  },
  'Batteries (Li-ion/Lead)': {
    trend: '+3.5%',
    trendUp: true,
    qualityBasis: 'Intact Unswollen Li-ion Packs & Heavy Lead-Acid Inverter Casings',
    demand: 'EV & Battery Recycler Backing'
  },
  'Wires & Copper Cables': {
    trend: '+8.1%',
    trendUp: true,
    qualityBasis: 'Insulated Millberry Copper Wires (>40% Metal Content)',
    demand: 'High Direct Foundry Demand'
  },
  'Mobile Phones & Chargers': {
    trend: 'Steady',
    trendUp: false,
    qualityBasis: 'Motherboard IC intact; Chargers sorted by copper grade',
    demand: 'Secondary Metal Extraction'
  },
  'Laptops & Computers': {
    trend: '+4.0%',
    trendUp: true,
    qualityBasis: 'RAM, Processors, and heat-sink copper complete',
    demand: 'E-Waste Hub Smelters'
  },
  'Mixed E-Waste': {
    trend: 'Steady',
    trendUp: false,
    qualityBasis: 'Dry, unsorted legacy household and office electronics',
    demand: 'Mechanical Separation Units'
  },
  'Screens & Displays': {
    trend: 'Steady',
    trendUp: false,
    qualityBasis: 'Cracked or scrap TFT/LED panels without PCB dismantling',
    demand: 'Glass & Rare Earth Extraction'
  }
};

const PriceBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const filteredCategories = MATERIAL_CATEGORIES.filter((c) => {
    const matchesSearch = c.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedTag === 'all') return matchesSearch;
    return matchesSearch && c.toLowerCase().includes(selectedTag.toLowerCase());
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-page)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Header Title with Shimmer Badge */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="shimmer-badge" style={{ marginBottom: '1rem' }}>
              <span className="live-pulse-dot" />
              <span>Real-Time Indicative E-Waste Spot Rates • Updated Today</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.65rem', letterSpacing: '-0.02em' }}>
              E-Waste Reference <span className="gradient-text">Price Board</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', maxWidth: '780px', lineHeight: '1.6' }}>
              Official benchmark rates established in collaboration with certified recyclers. Use these spot reference values to ensure you never accept unfair under-the-table middleman bids.
            </p>
          </div>

          {/* Legal / Transparency Notice Box with Glass Accent */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1.5px solid #fde68a',
              padding: '1.4rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2.25rem',
              color: '#92400e',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <div>
              <strong style={{ color: '#78350f' }}>CPCB Fair-Trade Mandate:</strong> Rates displayed below reflect dry, segregated scrap lots. Final recycler bids on the platform are submitted directly by industrial buyers and may exceed benchmark prices depending on gold/copper purity and verified scale weigh-in at pickup.
            </div>
          </div>

          {/* Search Bar & Filter Chips */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              marginBottom: '2rem',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Search materials (e.g. PCB, Copper, Battery, Laptop)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '2.75rem',
                  fontSize: '1rem'
                }}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Quick Filter Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
                Filter:
              </span>
              {['all', 'pcb', 'battery', 'copper', 'phone', 'laptop'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedTag === tag ? 'var(--color-brand-500)' : 'var(--color-border-default)',
                    backgroundColor: selectedTag === tag ? 'var(--color-brand-600)' : '#ffffff',
                    color: selectedTag === tag ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Pricing Table */}
          <div className="table-responsive" style={{ marginBottom: '3rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Material Category</th>
                  <th>Reference Price</th>
                  <th>30-Day Trend</th>
                  <th>Quality Basis</th>
                  <th style={{ textAlign: 'right' }}>Direct Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      No material matches found for &quot;{searchTerm}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => {
                    const detail = categoryDetails[cat] || {
                      trend: 'Steady',
                      trendUp: false,
                      qualityBasis: 'Segregated & Dry Scrap Lot',
                      demand: 'Recycling Processing'
                    };

                    return (
                      <tr key={cat}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-text-primary)' }}>
                            {cat}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-brand-700)', fontWeight: 600 }}>
                            {detail.demand}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--color-brand-700)', fontSize: '1.25rem' }}>
                              {formatINR(REFERENCE_RATES[cat])}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>/ kg</span>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              backgroundColor: detail.trendUp ? 'var(--color-brand-100)' : '#f1f5f9',
                              color: detail.trendUp ? 'var(--color-brand-900)' : '#475569'
                            }}
                          >
                            {detail.trendUp ? '▲' : '●'} {detail.trend}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '280px' }}>
                          {detail.qualityBasis}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link
                            to="/register"
                            className="btn btn-primary"
                            style={{
                              padding: '0.45rem 1rem',
                              fontSize: '0.85rem',
                              minHeight: '38px',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            Sell Lot →
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Material Quality Cheat Sheet Card */}
          <div
            className="card"
            style={{
              padding: '2.25rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)',
              border: '1.5px solid var(--color-border-brand)'
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              💡 How to Maximize Your Lot Valuation
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Authorized recyclers pay higher premiums when scrap lots arrive clean, dry, and properly segregated by metal type.
            </p>

            <div className="grid-3">
              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-brand-700)', display: 'block', marginBottom: '0.35rem' }}>
                  1. Keep PCBs Dry & Whole
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Do not break motherboards or soak them in acid. Intact telecommunication and server boards yield the highest gold/silver recovery rates.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-brand-700)', display: 'block', marginBottom: '0.35rem' }}>
                  2. Strip Copper Safely
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Never burn insulated cables. Recyclers reject soot-blackened wires due to PVC contamination and toxic dioxins.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-muted)' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-brand-700)', display: 'block', marginBottom: '0.35rem' }}>
                  3. Isolate Batteries
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Keep lithium-ion packs segregated from ferrous scrap to prevent short circuits, spark hazards, and thermal runaway during transport.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PriceBoard;