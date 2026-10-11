import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        borderTop: '1px solid #1e293b',
        position: 'relative',
        marginTop: 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Top Emerald Gradient Glow Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #059669 100%)'
        }}
      />

      <div className="container" style={{ paddingTop: '4.5rem', paddingBottom: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Brand Info & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                  <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0 0-1.8L17 9" />
                  <path d="M13 3.4a1.8 1.8 0 0 0-1.6-.9 1.8 1.8 0 0 0-1.6.9L7 8" />
                  <path d="m14 14 3 3 3-3" />
                  <path d="m5 10 3-3 3 3" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
                Kabadiwala<span style={{ color: '#34d399' }}>Connect</span>
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: '1.7', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Transforming the informal recycling landscape into a digital, transparent, and fair economy. Directly linking local kabadiwalas to certified smelters & recyclers.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                backgroundColor: '#1e293b',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.2)'
              }}
            >
              <span>🛡️ CPCB / SPCB Circular Economy Compliant</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Market Tools
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Link to="/price-board" style={{ color: '#94a3b8' }} onMouseEnter={(e) => (e.target.style.color = '#34d399')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>
                Live Spot Rates Board
              </Link>
              <Link to="/recyclers" style={{ color: '#94a3b8' }} onMouseEnter={(e) => (e.target.style.color = '#34d399')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>
                Authorized Recyclers Directory
              </Link>
              <Link to="/safety-guide" style={{ color: '#94a3b8' }} onMouseEnter={(e) => (e.target.style.color = '#34d399')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>
                Non-Toxic Handling Guide
              </Link>
              <Link to="/login" style={{ color: '#94a3b8' }} onMouseEnter={(e) => (e.target.style.color = '#34d399')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>
                Collector Sign In
              </Link>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              E-Waste Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#94a3b8' }}>• Printed Circuit Boards (PCBs)</span>
              <span style={{ color: '#94a3b8' }}>• Insulated Copper Cables & Wire</span>
              <span style={{ color: '#94a3b8' }}>• Lithium-ion & Lead Batteries</span>
              <span style={{ color: '#94a3b8' }}>• Mobile Phones & Laptops</span>
              <span style={{ color: '#94a3b8' }}>• Monitored Cathode & Display Panels</span>
            </div>
          </div>

          {/* Transparency & Impact */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Zero Middleman Promise
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.7', color: '#94a3b8', marginBottom: '1rem' }}>
              All material lots sold through Kabadiwala Connect include verified digital weigh-ins and direct bank/cash settlement receipts to eliminate fraud.
            </p>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <div style={{ padding: '0.5rem 0.8rem', backgroundColor: '#1e293b', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#e2e8f0', border: '1px solid #334155' }}>
                🔒 256-bit Encrypted
              </div>
              <div style={{ padding: '0.5rem 0.8rem', backgroundColor: '#1e293b', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#e2e8f0', border: '1px solid #334155' }}>
                ⚡ Instant Receipts
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            fontSize: '0.84rem',
            color: '#64748b'
          }}
        >
          <div>
            © {new Date().getFullYear()} Kabadiwala Connect Inc. Formalizing circular e-waste across India.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/safety-guide" style={{ color: '#64748b' }}>Environmental Compliance</Link>
            <Link to="/price-board" style={{ color: '#64748b' }}>Market Rates</Link>
            <span style={{ color: '#059669', fontWeight: 600 }}>100% Made for Clean India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;