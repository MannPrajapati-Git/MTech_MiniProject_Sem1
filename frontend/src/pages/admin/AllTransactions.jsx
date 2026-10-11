import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filtered = transactions.filter((tx) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      tx.receiptId?.toLowerCase().includes(q) ||
      tx.listing?.title?.toLowerCase().includes(q) ||
      tx.collector?.name?.toLowerCase().includes(q) ||
      tx.recycler?.name?.toLowerCase().includes(q) ||
      tx.recycler?.recyclerDetails?.companyName?.toLowerCase().includes(q);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && tx.transactionStatus === statusFilter;
  });

  return (
    <DashboardLayout title="Immutable Traceability & Audit Ledger">
      {/* Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        </div>
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--gray-900)', margin: '0 0 0.2rem' }}>
            Chain-of-Custody Material Traceability
          </h4>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
            This immutable digital manifest registers every physical e-waste transfer from collector to authorized recycler, ensuring full compliance with Central Pollution Control Board mandates and preventing informal toxic dumping.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--gray-100)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          {['all', 'scheduled', 'picked_up', 'paid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === st ? '#ffffff' : 'transparent',
                color: statusFilter === st ? 'var(--gray-900)' : 'var(--gray-500)',
                boxShadow: statusFilter === st ? 'var(--shadow-xs)' : 'none',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease'
              }}
            >
              {st === 'all' ? 'All Settlements' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search receipt, lot, collector, recycler..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem 1rem 0.5rem 2.25rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gray-300)',
              backgroundColor: '#ffffff',
              outline: 'none',
              width: '280px'
            }}
          />
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--gray-400)"
            strokeWidth="2"
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving traceability logs..." />
      ) : filtered.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gray-200)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: 'var(--gray-500)'
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
          <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No manifests recorded</div>
          <div style={{ fontSize: '0.85rem' }}>No transaction settlements matching the current search parameters.</div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gray-200)',
            boxShadow: 'var(--shadow-xs)',
            overflow: 'hidden'
          }}
        >
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Material Lot</th>
                  <th>Collector Origin</th>
                  <th>Authorized Facility</th>
                  <th>Rate</th>
                  <th>Verified Weight</th>
                  <th>Settled Total</th>
                  <th>Custody Status</th>
                  <th>Payment</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx._id}>
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
                        {tx.receiptId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                        {tx.listing?.title || 'E-Waste Lot'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {tx.listing?.category || 'Segregated'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{tx.collector?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{tx.collector?.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                        {tx.recycler?.recyclerDetails?.companyName || tx.recycler?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>SPCB Verified</div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--gray-800)', whiteSpace: 'nowrap' }}>
                      {formatINR(tx.finalRatePerKg)} <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>/kg</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                      {tx.verifiedWeight ? formatWeight(tx.verifiedWeight) : 'Pending Scale'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.92rem' }}>
                        {tx.finalAmount ? formatINR(tx.finalAmount) : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={tx.transactionStatus} />
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor: tx.paymentStatus === 'completed' ? 'var(--primary-50)' : '#fffbeb',
                          color: tx.paymentStatus === 'completed' ? 'var(--primary-800)' : '#92400e',
                          border: `1px solid ${tx.paymentStatus === 'completed' ? 'var(--primary-200)' : '#fde68a'}`
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: tx.paymentStatus === 'completed' ? '#10b981' : '#f59e0b'
                          }}
                        />
                        {tx.paymentStatus === 'completed' ? 'Paid & Discharged' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllTransactions;