import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight } from '../../utils/formatters';

const CollectorTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get('/collector/transactions');
        if (res.data?.success) setTransactions(res.data.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <DashboardLayout title="Transactions & Receipts">
      {loading ? (
        <LoadingSpinner message="Retrieving digital receipts..." />
      ) : transactions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No transaction records found yet. Once you accept a recycler's offer, your receipts will be tracked here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {transactions.map((tx) => (
            <div key={tx._id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Receipt #{tx.receiptId}</span>
                    <StatusBadge status={tx.transactionStatus} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Recycler: <strong>{tx.recycler?.recyclerDetails?.companyName || tx.recycler?.name}</strong> &nbsp;|&nbsp;
                    Phone: {tx.recycler?.phone}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                    Final Settled Amount
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: tx.finalAmount ? 'var(--color-brand-600)' : 'var(--color-text-secondary)' }}>
                    {tx.finalAmount ? formatINR(tx.finalAmount) : 'Pending Verification'}
                  </span>
                </div>
              </div>

              <div className="grid-4" style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Material</span>
                  <strong>{tx.listing?.title || 'E-Waste Lot'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Agreed Rate</span>
                  <strong>{formatINR(tx.finalRatePerKg)} / kg</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Verified Weight</span>
                  <strong>{tx.verifiedWeight ? formatWeight(tx.verifiedWeight) : 'Pending Pickup'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Payment Status</span>
                  <span style={{
                    color: tx.paymentStatus === 'completed' ? 'var(--color-brand-700)' : 'var(--color-warning-text)',
                    fontWeight: 700
                  }}>
                    {tx.paymentStatus === 'completed' ? '✓ Paid' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              {tx.notes && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Handover Notes: "{tx.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CollectorTransactions;