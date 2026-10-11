import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ScrollToTop from './ScrollToTop';

const DashboardLayout = ({ title, children, actions }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-page)' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            padding: '2.25rem 2.75rem',
            backgroundColor: 'var(--color-surface-page)',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
        >
          {title && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1.25rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--color-border-default)'
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {title}
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Kabadiwala Connect Platform Management
                </p>
              </div>

              {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{actions}</div>}
            </div>
          )}

          {children}
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default DashboardLayout;