import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const PickupManagement = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verification modal state
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [verifyForm, setVerifyForm] = useState({
    verifiedWeight: '',
    paymentStatus: 'completed',
    notes: ''
  });

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const res = await API.get('/recycler/pickups');
      if (res.data?.success) setPickups(res.data.data);
    } catch (err) {
      console.error('Error fetching pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleOpenVerifyModal = (tx) => {
    setSelectedTx(tx);
    setVerifyForm({
      verifiedWeight: tx.listing?.estimatedWeight || '',
      paymentStatus: 'completed',
      notes: ''
    });
    setModalOpen(true);
  };

  const handleConfirmVerification = async () => {
    if (!verifyForm.verifiedWeight || Number(verifyForm.verifiedWeight) <= 0) {
      alert('Please enter a valid scale-verified weight');
      return;
    }

    setVerifying(true);
    try {
      const res = await API.put(`/recycler/transaction/${selectedTx._id}/verify`, {
        verifiedWeight: Number(verifyForm.verifiedWeight),
        paymentStatus: verifyForm.paymentStatus,
        notes: verifyForm.notes
      });

      if (res.data?.success) {
        setModalOpen(false);
        alert('Material handover verified & transaction closed!');
        fetchPickups();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  // Live final amount calculation for modal
  const weightInput = parseFloat(verifyForm.verifiedWeight) || 0;
  const calculatedFinalAmount = weightInput * (selectedTx?.finalRatePerKg || 0);

  return (
    <DashboardLayout title="Pickup Logistics & Handover Ledger">
      {loading ? (
        <LoadingSpinner message="Loading scheduled pickups..." />
      ) : pickups.length === 0 ? (
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
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No pickups currently assigned</div>
          <div style={{ fontSize: '0.85rem' }}>When a scrap aggregator accepts your bid, the dispatch voucher will be listed here.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pickups.map((tx) => {
            const isCompleted = tx.transactionStatus === 'completed';

            return (
              <div
                key={tx._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--gray-200)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: 'var(--gray-800)',
                          backgroundColor: 'var(--gray-100)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        Receipt #{tx.receiptId}
                      </span>
                      <StatusBadge status={tx.transactionStatus} />
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                      Collector: <strong style={{ color: 'var(--gray-900)' }}>{tx.collector?.name}</strong> &nbsp;|&nbsp;
                      Phone: <a href={`tel:${tx.collector?.phone}`} style={{ color: 'var(--primary-700)', textDecoration: 'none' }}>{tx.collector?.phone}</a>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', display: 'block' }}>
                      Contracted Spot Rate
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {formatINR(tx.finalRatePerKg)} <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>/ kg</span>
                    </span>
                  </div>
                </div>

                <div
                  className="grid-3"
                  style={{
                    backgroundColor: 'var(--gray-50)',
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--gray-200)'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--gray-500)', display: 'block', fontSize: '0.78rem' }}>Material Stream:</span>
                    <strong style={{ color: 'var(--gray-900)' }}>{tx.listing?.title}</strong> ({tx.listing?.category})
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray-500)', display: 'block', fontSize: '0.78rem' }}>Pickup Facility Location:</span>
                    <strong style={{ color: 'var(--gray-900)' }}>
                      {tx.collector?.address?.street}, {tx.collector?.address?.city}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--gray-500)', display: 'block', fontSize: '0.78rem' }}>Scale Verified & Settled:</span>
                    <strong style={{ color: isCompleted ? 'var(--primary-700)' : 'var(--gray-700)' }}>
                      {isCompleted ? `${formatWeight(tx.verifiedWeight)} (${formatINR(tx.finalAmount)})` : 'Pending Scale Intake'}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                  {!isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleOpenVerifyModal(tx)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      Verify Scale Weight & Close Deal
                    </button>
                  ) : (
                    <span
                      style={{
                        color: 'var(--primary-800)',
                        backgroundColor: 'var(--primary-50)',
                        border: '1px solid var(--primary-200)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      ✓ Handover Completed on {formatDate(tx.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Verification Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Weigh-in & Handover Settlement"
        confirmText="Finalize Handover & Generate Receipt"
        onConfirm={handleConfirmVerification}
        isLoading={verifying}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>
            Enter the certified physical weight recorded on the digital scale during handover at site.
          </p>

          <div className="form-group">
            <label className="form-label">Physically Verified Net Weight (in KG) *</label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              required
              className="form-input"
              value={verifyForm.verifiedWeight}
              onChange={(e) => setVerifyForm({ ...verifyForm, verifiedWeight: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Settlement Status *</label>
            <select
              className="form-select"
              value={verifyForm.paymentStatus}
              onChange={(e) => setVerifyForm({ ...verifyForm, paymentStatus: e.target.value })}
            >
              <option value="completed">Payment Settled (IMPS / UPI / Instant Transfer)</option>
              <option value="pending">Net 7 Days Corporate Invoice Settlement</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Handover Quality Remarks (Optional)</label>
            <textarea
              rows="2"
              className="form-textarea"
              placeholder="e.g. Segregation verified. No wet batteries or hazard leaks detected."
              value={verifyForm.notes}
              onChange={(e) => setVerifyForm({ ...verifyForm, notes: e.target.value })}
            />
          </div>

          {/* Interactive Settlement Summary Box */}
          <div
            style={{
              backgroundColor: 'var(--primary-50)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-200)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem', color: 'var(--gray-600)' }}>
              <span>Agreed Unit Spot Rate:</span>
              <strong style={{ color: 'var(--gray-900)' }}>{formatINR(selectedTx?.finalRatePerKg)} / kg</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem', color: 'var(--gray-600)' }}>
              <span>Scale Net Weight:</span>
              <strong style={{ color: 'var(--gray-900)' }}>{formatWeight(weightInput)}</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--primary-200)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.88rem' }}>Final Total Payout:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {formatINR(calculatedFinalAmount)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default PickupManagement;