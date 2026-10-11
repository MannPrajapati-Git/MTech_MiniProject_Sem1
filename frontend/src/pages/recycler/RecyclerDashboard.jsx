import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import { formatINR, formatWeight } from '../../utils/formatters';

const RecyclerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableLots, setAvailableLots] = useState([]);
  const [myQuotes, setMyQuotes] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecyclerData = async () => {
      try {
        setLoading(true);
        const [lotsRes, quotesRes, pickupsRes] = await Promise.all([
          API.get('/recycler/listings'),
          API.get('/recycler/quotes'),
          API.get('/recycler/pickups')
        ]);

        if (lotsRes.data?.success) setAvailableLots(lotsRes.data.data);
        if (quotesRes.data?.success) setMyQuotes(quotesRes.data.data);
        if (pickupsRes.data?.success) setPickups(pickupsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recycler metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchRecyclerData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Recycler Procurement Hub">
        <LoadingSpinner message="Calculating available material supply & bids..." />
      </DashboardLayout>
    );
  }

  // Calculate Key Figures
  const pendingLotsCount = availableLots.length;
  const activeQuotesCount = myQuotes.filter((q) => q.status === 'pending').length;
  const scheduledPickupsCount = pickups.filter((p) => p.transactionStatus === 'scheduled').length;
  const completedDeals = pickups.filter((p) => p.transactionStatus === 'completed');
  const totalProcuredWeight = completedDeals.reduce((sum, item) => sum + (item.verifiedWeight || 0), 0);

  return (
    <DashboardLayout
      title="Procurement Operations Hub"
      actions={
        <Link
          to="/recycler/listings"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Browse Available Lots
        </Link>
      }
    >
      {/* Verification Warning Alert */}
      {!user?.isVerified && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem', color: '#92400e', fontSize: '0.95rem', fontWeight: 800 }}>
              Account Pending State Pollution Control Board (SPCB) Verification
            </h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#b45309', lineHeight: 1.5 }}>
              Your CPCB/SPCB hazardous authorization number and GSTIN documents are currently being audited by the platform administrator. Once verified, live quotation bidding will be automatically unlocked for your facility.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            padding: '0.9rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #fecaca',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Open Material Lots"
          value={pendingLotsCount}
          subtext="Available for quoting"
          trend="Live Market"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          }
        />
        <StatCard
          title="Active Quotations"
          value={activeQuotesCount}
          subtext="Awaiting collector reply"
          trend="Submitted"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
        />
        <StatCard
          title="Scheduled Pickups"
          value={scheduledPickupsCount}
          subtext="En route / pending scale"
          trend={scheduledPickupsCount > 0 ? 'Pending Action' : 'Clear'}
          trendPositive={scheduledPickupsCount === 0}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          }
        />
        <StatCard
          title="Procured Material"
          value={formatWeight(totalProcuredWeight)}
          subtext="Verified physical intake"
          trend="Industrial Supply"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0 0-1.8L17 9" />
              <path d="M13 3.4a1.8 1.8 0 0 0-1.6-.9 1.8 1.8 0 0 0-1.6.9L7 8" />
              <path d="m14 14 3 3 3-3" />
              <path d="m5 10 3-3 3 3" />
            </svg>
          }
        />
      </div>

      {/* Immediate Pickups Section */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--gray-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>
              Pending Scheduled Handover Pickups
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: '0.2rem 0 0' }}>
              Confirmed bids awaiting scale verification and payment settlement
            </p>
          </div>
          <Link
            to="/recycler/pickups"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-700)', textDecoration: 'none' }}
          >
            Manage All Pickups →
          </Link>
        </div>

        {pickups.filter((p) => p.transactionStatus === 'scheduled').length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--gray-500)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No pending pickups currently scheduled</div>
            <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              Submit competitive bids on available e-waste lots to secure verified industrial material streams.
            </p>
            <Link to="/recycler/listings" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Explore Available Lots
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Material Lot</th>
                  <th>Collector Contact</th>
                  <th>Agreed Rate</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Handover Action</th>
                </tr>
              </thead>
              <tbody>
                {pickups
                  .filter((p) => p.transactionStatus === 'scheduled')
                  .slice(0, 6)
                  .map((item) => (
                    <tr key={item._id}>
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            color: 'var(--gray-800)',
                            backgroundColor: 'var(--gray-100)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          {item.receiptId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>
                          {item.listing?.title || 'E-Waste Material'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                          {item.listing?.category || 'Segregated Lot'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{item.collector?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.collector?.phone}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                        {formatINR(item.finalRatePerKg)} <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>/kg</span>
                      </td>
                      <td>
                        <StatusBadge status={item.transactionStatus} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to="/recycler/pickups"
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderRadius: 'var(--radius-sm)' }}
                        >
                          Verify Scale Intake →
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecyclerDashboard;