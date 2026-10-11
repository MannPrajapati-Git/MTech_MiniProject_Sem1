import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--gray-900)',
        color: 'var(--gray-400)',
        marginTop: 'auto',
        borderTop: '1px solid var(--gray-800)'
      }}
    >
      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0 0-1.8L17 9" />
                <path d="M13 3.4a1.8 1.8 0 0 0-1.6-.9 1.8 1.8 0 0 0-1.6.9L7 8" />
                <path d="m14 14 3 3 3-3" />
                <path d="m5 10 3-3 3 3" />
              </svg>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                Kabadiwala<span style={{ color: '#22c55e' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', lineHeight: '1.7', color: 'var(--gray-400)' }}>
              India&apos;s first formal e-waste exchange platform connecting local kabadiwalas directly with certified industrial recyclers.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-200)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: 'Price Board', path: '/price-board' },
                { label: 'Recycler Directory', path: '/recyclers' },
                { label: 'Safety Guide', path: '/safety-guide' },
                { label: 'Sign In', path: '/login' }
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{ color: 'var(--gray-400)', fontSize: '0.8125rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-400)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-200)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
              <span>PCB Boards</span>
              <span>Copper Cables & Wires</span>
              <span>Li-ion Batteries</span>
              <span>Mobile Phones & Laptops</span>
            </div>
          </div>

          {/* Compliance */}
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-200)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trust & Safety
            </h4>
            <p style={{ fontSize: '0.8125rem', lineHeight: '1.7', color: 'var(--gray-400)', marginBottom: '1rem' }}>
              All transactions include digital weigh-ins and verified receipts for complete traceability.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.25rem 0.625rem', backgroundColor: 'var(--gray-800)', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', color: 'var(--gray-300)', border: '1px solid var(--gray-700)' }}>
                CPCB Compliant
              </span>
              <span style={{ padding: '0.25rem 0.625rem', backgroundColor: 'var(--gray-800)', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', color: 'var(--gray-300)', border: '1px solid var(--gray-700)' }}>
                SPCB Verified
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--gray-800)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.75rem',
            color: 'var(--gray-500)'
          }}
        >
          <span>© {new Date().getFullYear()} Kabadiwala Connect. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/safety-guide" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gray-300)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-500)')}
            >
              Compliance
            </Link>
            <Link to="/price-board" style={{ color: 'var(--gray-500)', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gray-300)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-500)')}
            >
              Market Rates
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;