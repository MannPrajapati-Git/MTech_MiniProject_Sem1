import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/collector/listings');
        if (res.data?.success) setListings(res.data.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <DashboardLayout
      title="My E-Waste Listings"
      actions={
        <Link to="/collector/listings/new" className="btn btn-primary">
          + Create Listing
        </Link>
      }
    >
      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'quoted', 'accepted', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className="btn"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.85rem',
              textTransform: 'capitalize',
              backgroundColor: filter === status ? 'var(--color-brand-600)' : 'var(--color-surface-base)',
              color: filter === status ? '#fff' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-default)'
            }}
          >
            {status === 'all' ? 'All Listings' : status}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your listings..." />
      ) : filteredListings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            No listings found matching this status filter.
          </p>
          <Link to="/collector/listings/new" className="btn btn-primary">
            Create New Listing
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Est. Weight</th>
                <th>Condition</th>
                <th>Ref. Value</th>
                <th>Status</th>
                <th>Date Listed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((lot) => (
                <tr key={lot._id}>
                  <td style={{ fontWeight: 600 }}>{lot.title}</td>
                  <td>{lot.category}</td>
                  <td>{formatWeight(lot.estimatedWeight)}</td>
                  <td>{lot.condition}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-brand-700)' }}>
                    {formatINR(lot.estimatedTotalValue)}
                  </td>
                  <td>
                    <StatusBadge status={lot.status} />
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {formatDate(lot.createdAt)}
                  </td>
                  <td>
                    <Link
                      to={`/collector/listings/${lot._id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      View & Bids
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyListings;