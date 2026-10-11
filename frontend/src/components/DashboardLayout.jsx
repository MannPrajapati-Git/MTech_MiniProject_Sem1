import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ title, children, actions }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-muted)' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main
          className="dashboard-main"
          style={{
            flex: 1,
            padding: '1.5rem 2rem',
            maxWidth: '100%',
            overflowX: 'hidden',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          {title && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {title}
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                  Kabadiwala Connect Platform
                </p>
              </div>
              {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-main {
            padding: 1rem !important;
            padding-bottom: 4.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;