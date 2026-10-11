import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, transRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/transactions')
        ]);

        if (statsRes.data?.success) setStats(statsRes.data.data);
        if (transRes.data?.success) setRecentTransactions(transRes.data.data.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve administrative data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Control Centre">
        <LoadingSpinner message="Calculating platform metrics & audit logs..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Platform Operations Overview"
      actions={
        <Link to="/admin/recyclers" className="btn btn-primary">
          Verify Recyclers
        </Link>
      }
    >
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
        <StatCard
          title="Total Recycled E-Waste"
          value={formatWeight(stats?.totalWeightRecycledKg || 0)}
          icon="♻️"
          subtext="Physically verified at scale"
        />
        <StatCard
          title="Gross Transaction Volume"
          value={formatINR(stats?.totalTransactionVolumeINR || 0)}
          icon="💳"
          subtext="Formal circular payout"
        />
        <StatCard
          title="Active Collectors"
          value={stats?.totalCollectors || 0}
          icon="👷"
          subtext="Informal waste aggregators"
        />
        <StatCard
          title="Partner Recyclers"
          value={stats?.totalRecyclers || 0}
          icon="🏭"
          subtext="SPCB/CPCB authorized"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Recycler Verification</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Review government authorization numbers, GST certificates, and activate recyclers for bidding.
            </p>
          </div>
          <Link to="/admin/recyclers" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Review Applications →
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Material Traceability Ledger</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Inspect immutable transaction receipts from collector initial listing up to recycler weigh-in.
            </p>
          </div>
          <Link to="/admin/transactions" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Open Traceability Audit →
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>User Directory</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Monitor registration profiles, phone contact points, and geographical distribution.
            </p>
          </div>
          <Link to="/admin/users" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Manage Users →
          </Link>
        </div>
      </div>

      {/* Recent Settled Transactions Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Recent Traceable Settlements</h3>
          <Link to="/admin/transactions" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            View Full Ledger →
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-secondary)' }}>
            No platform transactions completed yet.
          </p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Receipt ID</th>
                  <th>Collector</th>
                  <th>Authorized Recycler</th>
                  <th>Verified Weight</th>
                  <th>Settled Payout</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td style={{ fontWeight: 600 }}>{tx.receiptId}</td>
                    <td>{tx.collector?.name}</td>
                    <td>{tx.recycler?.recyclerDetails?.companyName || tx.recycler?.name}</td>
                    <td>{tx.verifiedWeight ? formatWeight(tx.verifiedWeight) : 'Pending Pickup'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-brand-700)' }}>
                      {tx.finalAmount ? formatINR(tx.finalAmount) : 'Pending'}
                    </td>
                    <td>
                      <StatusBadge status={tx.transactionStatus} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(tx.createdAt)}
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

export default AdminDashboard;