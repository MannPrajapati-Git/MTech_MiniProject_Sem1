import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const MyQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await API.get('/recycler/quotes');
        if (res.data?.success) setQuotes(res.data.data);
      } catch (err) {
        console.error('Error fetching recycler quotes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  return (
    <DashboardLayout title="My Submitted Quotations">
      {loading ? (
        <LoadingSpinner message="Retrieving your bid records..." />
      ) : quotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            You haven't submitted any quotations yet. Browse available lots to make an offer.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Lot Title</th>
                <th>Category</th>
                <th>Est. Lot Weight</th>
                <th>Offered Rate</th>
                <th>Total Bid Amount</th>
                <th>Proposed Pickup</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q._id}>
                  <td style={{ fontWeight: 600 }}>{q.listing?.title || 'Lot Listing'}</td>
                  <td>{q.listing?.category}</td>
                  <td>{formatWeight(q.listing?.estimatedWeight)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-brand-700)' }}>
                    {formatINR(q.offeredPricePerKg)} / kg
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatINR(q.totalOfferedPrice)}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {formatDate(q.pickupDate)}
                  </td>
                  <td>
                    <StatusBadge status={q.status} />
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

export default MyQuotes;