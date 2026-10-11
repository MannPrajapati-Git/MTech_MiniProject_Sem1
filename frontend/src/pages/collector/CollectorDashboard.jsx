import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const CollectorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [listingsRes, transRes] = await Promise.all([
          API.get('/collector/listings'),
          API.get('/collector/transactions')
        ]);

        if (listingsRes.data?.success) setListings(listingsRes.data.data);
        if (transRes.data?.success) setTransactions(transRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Aggregator Control Hub">
        <LoadingSpinner message="Calculating your material inventory & bids..." />
      </DashboardLayout>
    );
  }

  // Calculate metrics
  const totalListingsCount = listings.length;
  const activeOffersCount = listings.filter((l) => l.status === 'quoted').length;
  const completedDeals = transactions.filter((t) => t.transactionStatus === 'completed');
  const totalEarnings = completedDeals.reduce((sum, item) => sum + (item.finalAmount || 0), 0);
  const totalWeightSold = completedDeals.reduce((sum, item) => sum + (item.verifiedWeight || 0), 0);

  return (
    <DashboardLayout
      title="Aggregator Operations Overview"
      actions={
        <Link
          to="/collector/listings/new"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Submit E-Waste Lot
        </Link>
      }
    >
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

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Lots Listed"
          value={totalListingsCount}
          subtext="Segregated material lots"
          trend="Inventory"
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
          title="Active Bids Received"
          value={activeOffersCount}
          subtext="Ready for rate approval"
          trend={activeOffersCount > 0 ? 'Action Needed' : 'Current'}
          trendPositive={activeOffersCount > 0}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        <StatCard
          title="Total Recycled Weight"
          value={formatWeight(totalWeightSold)}
          subtext="Certified scale handover"
          trend="Physical Intake"
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
        <StatCard
          title="Total Payout Realized"
          value={formatINR(totalEarnings)}
          subtext="Settled through platform"
          trend="+100% Traceable"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
      </div>

      {/* Recent Listings Snapshot */}
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
              Recent Material Listings & Bids
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: '0.2rem 0 0' }}>
              Real-time bids submitted by verified regional recyclers
            </p>
          </div>
          <Link
            to="/collector/listings"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-700)', textDecoration: 'none' }}
          >
            View All ({listings.length}) →
          </Link>
        </div>

        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--gray-500)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No e-waste lots submitted yet</div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              Upload your segregated scrap lots to invite competitive spot bids from authorized recyclers in your state.
            </p>
            <Link to="/collector/listings/new" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              Submit First Lot Now
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Material Lot</th>
                  <th>Category</th>
                  <th>Est. Weight</th>
                  <th>Benchmark Value</th>
                  <th>Quotation Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {listings.slice(0, 6).map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.condition || 'Mixed'} condition</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--gray-100)',
                          color: 'var(--gray-800)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                      {formatWeight(item.estimatedWeight)}
                    </td>
                    <td style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
                      {formatINR(item.estimatedTotalValue)}
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                      {formatDate(item.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/collector/listings/${item._id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderRadius: 'var(--radius-sm)' }}
                      >
                        View Bids →
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

export default CollectorDashboard;