import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight } from '../../utils/formatters';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/transactions');
        if (res.data?.success) setTransactions(res.data.data);
      } catch (err) {
        console.error('Error fetching admin transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <DashboardLayout title="End-to-End Traceability Ledger">
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-surface-subtle)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          🧾 <strong>Chain-of-Custody Verification:</strong> This immutable record logs every e-waste lot from collection to recycler handover, preventing unauthorized dumping or informal acid-burning.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving traceability logs..." />
      ) : transactions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No transactions recorded on the platform yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Material Lot</th>
                <th>Collector</th>
                <th>Authorized Recycler</th>
                <th>Agreed Rate</th>
                <th>Verified Weight</th>
                <th>Settled Payout</th>
                <th>Handover Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td style={{ fontWeight: 700 }}>{tx.receiptId}</td>
                  <td>{tx.listing?.title || 'E-Waste Lot'}</td>
                  <td>
                    <div>{tx.collector?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{tx.collector?.phone}</div>
                  </td>
                  <td>
                    <div>{tx.recycler?.recyclerDetails?.companyName || tx.recycler?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{tx.recycler?.phone}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatINR(tx.finalRatePerKg)} / kg</td>
                  <td>{tx.verifiedWeight ? formatWeight(tx.verifiedWeight) : 'Pending Pickup'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-brand-700)' }}>
                    {tx.finalAmount ? formatINR(tx.finalAmount) : 'Pending'}
                  </td>
                  <td>
                    <StatusBadge status={tx.transactionStatus} />
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: tx.paymentStatus === 'completed' ? 'var(--color-success-text)' : 'var(--color-warning-text)'
                    }}>
                      {tx.paymentStatus === 'completed' ? '✓ Paid' : 'Pending'}
                    </span>
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

export default AllTransactions;