import React, { useState, useEffect } from 'react';
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
      <DashboardLayout title="Collector Dashboard">
        <LoadingSpinner message="Fetching your e-waste stats..." />
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
      title="Collector Overview"
      actions={
        <Link to="/collector/listings/new" className="btn btn-primary">
          + Create New Listing
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

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <StatCard title="Total Lots Listed" value={totalListingsCount} icon="📦" subtext="All-time submissions" />
        <StatCard title="Active Quotations" value={activeOffersCount} icon="💬" subtext="Ready for your review" />
        <StatCard title="Total Weight Recycled" value={formatWeight(totalWeightSold)} icon="⚖️" subtext="Verified at pickup" />
        <StatCard title="Total Settlement" value={formatINR(totalEarnings)} icon="💰" subtext="Completed payouts" />
      </div>

      {/* Recent Listings Snapshot */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Recent Material Listings</h3>
          <Link to="/collector/listings" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            View All Listings →
          </Link>
        </div>

        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-secondary)' }}>
            <p style={{ marginBottom: '1rem' }}>You have not submitted any e-waste lots yet.</p>
            <Link to="/collector/listings/new" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
              Create First Listing
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Weight</th>
                  <th>Est. Value</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listings.slice(0, 5).map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{formatWeight(item.estimatedWeight)}</td>
                    <td style={{ color: 'var(--color-brand-700)', fontWeight: 600 }}>
                      {formatINR(item.estimatedTotalValue)}
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {formatDate(item.createdAt)}
                    </td>
                    <td>
                      <Link
                        to={`/collector/listings/${item._id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        View Offers
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