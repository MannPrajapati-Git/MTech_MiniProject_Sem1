import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

const sampleRecyclers = [
  {
    name: 'EcoGreen E-Waste Processors Pvt Ltd',
    city: 'New Delhi',
    state: 'Delhi',
    license: 'DPCC/EW-REG/2023/8842',
    capacity: '500 MT/Year',
    categories: ['PCB Boards', 'Laptops & Computers', 'Mixed E-Waste', 'Screens & Displays'],
    verifiedDate: 'Active 2024-2027',
    contactPerson: 'Er. Rajesh Sharma',
    phone: '+91 98110 24890'
  },
  {
    name: 'Bharat Circular Metals & Alloys',
    city: 'Ahmedabad',
    state: 'Gujarat',
    license: 'GPCB/HAZ-EW/GJ-9921',
    capacity: '1,200 MT/Year',
    categories: ['Wires & Copper Cables', 'Batteries (Li-ion/Lead)', 'PCB Boards'],
    verifiedDate: 'Active 2023-2026',
    contactPerson: 'Sunil Patel',
    phone: '+91 98250 11432'
  },
  {
    name: 'CleanTech Component Solutions',
    city: 'Bengaluru',
    state: 'Karnataka',
    license: 'KSPCB/EW-IND/KA-1029',
    capacity: '800 MT/Year',
    categories: ['Mobile Phones & Chargers', 'Screens & Displays', 'PCB Boards'],
    verifiedDate: 'Active 2024-2028',
    contactPerson: 'V. Anand Murthy',
    phone: '+91 94480 77312'
  },
  {
    name: 'MahaRecycle Industrial Smelters',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    license: 'MPCB/EW-REG/MH-5510',
    capacity: '2,500 MT/Year',
    categories: ['PCB Boards', 'Wires & Copper Cables', 'Batteries (Li-ion/Lead)', 'Laptops & Computers'],
    verifiedDate: 'Active 2023-2026',
    contactPerson: 'Aditya Kulkarni',
    phone: '+91 98200 45910'
  },
  {
    name: 'Tamil Nadu Eco-Refinery Hub',
    city: 'Chennai',
    state: 'Tamil Nadu',
    license: 'TNPCB/HAZ/TN-7729',
    capacity: '1,000 MT/Year',
    categories: ['Wires & Copper Cables', 'Mobile Phones & Chargers', 'Laptops & Computers'],
    verifiedDate: 'Active 2024-2027',
    contactPerson: 'K. Ranganathan',
    phone: '+91 98410 33890'
  }
];

const RecyclerDirectory = () => {
  const [filter, setFilter] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  const filtered = sampleRecyclers.filter((r) => {
    const matchesQuery =
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      r.city.toLowerCase().includes(filter.toLowerCase()) ||
      r.categories.some((c) => c.toLowerCase().includes(filter.toLowerCase()));

    if (selectedState === 'all') return matchesQuery;
    return matchesQuery && r.state.toLowerCase() === selectedState.toLowerCase();
  });

  const uniqueStates = ['all', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Tamil Nadu'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-page)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '1050px' }}>
          {/* Header Title with Shimmer Badge */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="shimmer-badge" style={{ marginBottom: '1rem' }}>
              <span className="live-pulse-dot" />
              <span>Government Pollution Control Board Authorized Facilities</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.65rem', letterSpacing: '-0.02em' }}>
              Verified <span className="gradient-text">Recyclers Directory</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', maxWidth: '780px', lineHeight: '1.6' }}>
              Browse government-approved industrial recyclers authorized under Central Pollution Control Board (CPCB) guidelines.
              All buyers undergo strict verification of GST, state pollution operating licenses, and hydrometallurgical plant standards.
            </p>
          </div>

          {/* Search Bar & State Filter Chips */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              marginBottom: '2.25rem',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Search by company name, city, or material (e.g. Delhi, PCB, Copper)..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.75rem', fontSize: '1rem' }}
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

            {/* State Filter Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
                State Region:
              </span>
              {uniqueStates.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedState === st ? 'var(--color-brand-500)' : 'var(--color-border-default)',
                    backgroundColor: selectedState === st ? 'var(--color-brand-600)' : '#ffffff',
                    color: selectedState === st ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {st === 'all' ? 'All India' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Recyclers Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-muted)' }}>
                No verified recyclers found matching &quot;{filter}&quot;. Try adjusting your search keywords.
              </div>
            ) : (
              filtered.map((r, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    padding: '1.85rem 2rem',
                    borderRadius: 'var(--radius-xl)',
                    borderLeft: '4.5px solid var(--color-brand-600)'
                  }}
                >
                  <div style={{ maxWidth: '640px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                        {r.name}
                      </h3>
                      <span
                        style={{
                          backgroundColor: 'var(--color-success-bg)',
                          color: 'var(--color-success-text)',
                          border: '1px solid var(--color-success-border)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <span>✓</span> SPCB Authorized
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '0.85rem' }}>
                      📍 <strong>{r.city}, {r.state}</strong> &nbsp;|&nbsp; Operating License: <code>{r.license}</code> &nbsp;|&nbsp; Capacity: {r.capacity}
                    </div>

                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Authorized Materials:
                      </span>
                      {r.categories.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-brand-800)',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-brand-700)', fontWeight: 700 }}>
                      ● Accepting Material Lots
                    </div>
                    <Link
                      to="/register"
                      className="btn btn-primary"
                      style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}
                    >
                      Sell Lot to This Recycler
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default RecyclerDirectory;