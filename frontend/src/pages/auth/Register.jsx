import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { MATERIAL_CATEGORIES } from '../../utils/constants';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('collector');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    companyName: '',
    gstNumber: '',
    licenseNumber: '',
    authorizedCategories: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (category) => {
    const current = formData.authorizedCategories;
    if (current.includes(category)) {
      setFormData({ ...formData, authorizedCategories: current.filter((c) => c !== category) });
    } else {
      setFormData({ ...formData, authorizedCategories: [...current, category] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: role,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    };

    if (role === 'recycler') {
      payload.recyclerDetails = {
        companyName: formData.companyName,
        gstNumber: formData.gstNumber,
        licenseNumber: formData.licenseNumber,
        authorizedCategories: formData.authorizedCategories
      };
    }

    const res = await register(payload);
    setLoading(false);

    if (res?.success) {
      if (role === 'collector') navigate('/collector/dashboard');
      else navigate('/recycler/dashboard');
    } else {
      setError(res?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-page)' }}>
      <Navbar />

      <main
        className="bg-ambient-glow"
        style={{
          flex: 1,
          padding: '4rem 1.25rem',
          position: 'relative'
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.75rem 2.5rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            backgroundColor: '#ffffff',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.45rem', letterSpacing: '-0.02em' }}>
              Create Your Account
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Join India&apos;s verified digital e-waste management network
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              backgroundColor: 'var(--color-surface-muted)',
              padding: '0.45rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem'
            }}
          >
            <button
              type="button"
              onClick={() => setRole('collector')}
              style={{
                padding: '0.8rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                backgroundColor: role === 'collector' ? '#ffffff' : 'transparent',
                color: role === 'collector' ? 'var(--color-brand-800)' : 'var(--color-text-secondary)',
                boxShadow: role === 'collector' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <span>📦</span>
              <span>Collector (Kabadiwala)</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('recycler')}
              style={{
                padding: '0.8rem',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                backgroundColor: role === 'recycler' ? '#ffffff' : 'transparent',
                color: role === 'recycler' ? 'var(--color-brand-800)' : 'var(--color-text-secondary)',
                boxShadow: role === 'recycler' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <span>🏭</span>
              <span>Authorized Recycler</span>
            </button>
          </div>

          {role === 'recycler' && (
            <div
              style={{
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                padding: '0.95rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
                marginBottom: '1.75rem',
                border: '1.5px solid #bfdbfe',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>ℹ️</span>
              <div>
                <strong>Recycler Verification Process:</strong> Recycler accounts require admin review of your State Pollution Control Board (SPCB) operating license and GST before live bidding is unlocked.
              </div>
            </div>
          )}

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
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{role === 'recycler' ? 'Authorized Person Name' : 'Full Name'} *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g. Ramesh Kumar" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-input" placeholder="e.g. 9876543210" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" placeholder="name@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Password * (Min. 6 chars)</label>
                <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} className="form-input" placeholder="Create strong password" />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', marginBottom: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-muted)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                📍 Location & Pickup Dispatch Address
              </h4>
            </div>

            <div className="form-group">
              <label className="form-label">Street / Colony Address *</label>
              <input type="text" name="street" required value={formData.street} onChange={handleChange} className="form-input" placeholder="e.g. Plot 14, Okhla Phase 2" />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} className="form-input" placeholder="New Delhi" />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input type="text" name="state" required value={formData.state} onChange={handleChange} className="form-input" placeholder="Delhi" />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="form-input" placeholder="110020" />
              </div>
            </div>

            {/* Recycler KYC details */}
            {role === 'recycler' && (
              <>
                <div style={{ marginTop: '1.5rem', marginBottom: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-muted)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    🏭 Recycler Facility Compliance & Categories
                  </h4>
                </div>

                <div className="form-group">
                  <label className="form-label">Registered Company / Unit Name *</label>
                  <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="form-input" placeholder="e.g. EcoGreen Recyclers Pvt Ltd" />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">GST Identification Number (GSTIN) *</label>
                    <input type="text" name="gstNumber" required value={formData.gstNumber} onChange={handleChange} className="form-input" placeholder="07AAAAA0000A1Z5" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SPCB / CPCB Consent Number *</label>
                    <input type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleChange} className="form-input" placeholder="DPCC/EW/2023/8842" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Accepted Material Categories for Processing</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginTop: '0.5rem' }}>
                    {MATERIAL_CATEGORIES.map((cat) => {
                      const isChecked = formData.authorizedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-surface-subtle)',
                            border: `1px solid ${isChecked ? 'var(--color-brand-500)' : 'var(--color-border-default)'}`,
                            fontSize: '0.86rem',
                            fontWeight: isChecked ? 700 : 500,
                            color: isChecked ? 'var(--color-brand-800)' : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(cat)}
                            style={{ accentColor: 'var(--color-brand-600)', width: '16px', height: '16px' }}
                          />
                          <span>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '2rem', fontSize: '1.02rem', minHeight: '48px' }}
              disabled={loading}
            >
              {loading ? 'Creating Verified Account...' : 'Complete Free Registration →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-brand-600)' }}>
              Sign In to Your Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Register;