import React, { useState, useEffect } from 'react';
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
      <DashboardLayout title="Recycler Portal">
        <LoadingSpinner message="Loading procurement statistics..." />
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
      title="Recycler Dashboard"
      actions={
        <Link to="/recycler/listings" className="btn btn-primary">
          Browse Available Lots
        </Link>
      }
    >
      {/* Verification Warning Alert */}
      {!user?.isVerified && (
        <div style={{
          backgroundColor: 'var(--color-warning-bg)',
          border: '1px solid #f2cd72',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⏳</span>
          <div>
            <h4 style={{ margin: 0, color: 'var(--color-warning-text)' }}>Account Pending Admin Verification</h4>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--color-warning-text)' }}>
              Your CPCB/SPCB credentials and GST documents are currently being audited by the platform administrator.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger-text)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <StatCard title="Available Lots" value={pendingLotsCount} icon="📦" subtext="Open for quotations" />
        <StatCard title="Active Quotations" value={activeQuotesCount} icon="📝" subtext="Awaiting collector reply" />
        <StatCard title="Pickups Scheduled" value={scheduledPickupsCount} icon="🚚" subtext="Awaiting physical handover" />
        <StatCard title="Procured Weight" value={formatWeight(totalProcuredWeight)} icon="⚖️" subtext="Verified e-waste" />
      </div>

      {/* Immediate Pickups Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Pending Scheduled Pickups</h3>
          <Link to="/recycler/pickups" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Manage All Pickups →
          </Link>
        </div>

        {pickups.filter((p) => p.transactionStatus === 'scheduled').length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-secondary)' }}>
            No pickups currently pending. Check available lots to place competitive bids.
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Material</th>
                  <th>Collector Contact</th>
                  <th>Agreed Rate</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pickups
                  .filter((p) => p.transactionStatus === 'scheduled')
                  .slice(0, 5)
                  .map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600 }}>{item.receiptId}</td>
                      <td>{item.listing?.title || 'E-Waste Material'}</td>
                      <td>
                        {item.collector?.name} ({item.collector?.phone})
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-brand-600)' }}>
                        {formatINR(item.finalRatePerKg)} / kg
                      </td>
                      <td>
                        <StatusBadge status={item.transactionStatus} />
                      </td>
                      <td>
                        <Link
                          to="/recycler/pickups"
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Verify Handover
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