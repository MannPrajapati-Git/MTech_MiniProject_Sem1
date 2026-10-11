import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res?.success) {
      const role = res.data.role;
      if (role === 'collector') navigate('/collector/dashboard');
      else if (role === 'recycler') navigate('/recycler/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } else {
      setError(res?.message || 'Invalid email or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-page)' }}>
      <Navbar />

      <main
        className="bg-ambient-glow"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.25rem',
          position: 'relative'
        }}
      >
        <div
          className="card"
          style={{
            width: 'min(100%, 460px)',
            padding: '2.75rem 2.25rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            backgroundColor: '#ffffff',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Top Brand Pill */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0 0-1.8L17 9" />
                <path d="M13 3.4a1.8 1.8 0 0 0-1.6-.9 1.8 1.8 0 0 0-1.6.9L7 8" />
                <path d="m14 14 3 3 3-3" />
                <path d="m5 10 3-3 3 3" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.45rem', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Sign in to manage your e-waste listings, bids & receipts
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger-text)',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
                marginBottom: '1.5rem',
                border: '1px solid var(--color-danger-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 500
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                className="form-input"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.75rem', fontSize: '1rem', minHeight: '48px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }}
                  />
                  Authenticating...
                </span>
              ) : (
                'Sign In to Dashboard →'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info Capsule */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border-muted)',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '0.2rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="m21 2-9.6 9.6" />
                <path d="m15.5 7.5 3 3L22 7l-3-3" />
              </svg>
              <span>Platform Access Notice:</span>
            </div>
            Sign in with your registered Collector or Recycler credentials, or use the master Admin account.
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-brand-600)' }}>
              Register Free
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;