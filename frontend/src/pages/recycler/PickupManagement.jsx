import React, { useState, useEffect } from 'react';
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
    <DashboardLayout title="Pickup & Handover Management">
      {loading ? (
        <LoadingSpinner message="Loading scheduled pickups..." />
      ) : pickups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No pickups currently assigned. When a collector accepts your quote, the handover order will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pickups.map((tx) => {
            const isCompleted = tx.transactionStatus === 'completed';

            return (
              <div key={tx._id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Receipt #{tx.receiptId}</span>
                      <StatusBadge status={tx.transactionStatus} />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                      Collector: <strong>{tx.collector?.name}</strong> &nbsp;|&nbsp;
                      Phone: <a href={`tel:${tx.collector?.phone}`}>{tx.collector?.phone}</a>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      Agreed Rate Per KG
                    </span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
                      {formatINR(tx.finalRatePerKg)} / kg
                    </span>
                  </div>
                </div>

                <div className="grid-3" style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Material Lot:</span>
                    <strong>{tx.listing?.title}</strong> ({tx.listing?.category})
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Collector Address:</span>
                    <strong>
                      {tx.collector?.address?.street}, {tx.collector?.address?.city}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Final Weight & Settlement:</span>
                    <strong>
                      {isCompleted ? `${formatWeight(tx.verifiedWeight)} (${formatINR(tx.finalAmount)})` : 'Pending Verification'}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                  {!isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleOpenVerifyModal(tx)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem' }}
                    >
                      ⚖️ Verify Physical Weight & Close Deal
                    </button>
                  ) : (
                    <span style={{ color: 'var(--color-brand-700)', fontWeight: 700, fontSize: '0.9rem' }}>
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
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Enter the exact weight recorded on the physical weighing scale during pickup.
          </p>

          <div className="form-group">
            <label className="form-label">Physically Verified Weight (in KG) *</label>
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
            <label className="form-label">Payment Status *</label>
            <select
              className="form-select"
              value={verifyForm.paymentStatus}
              onChange={(e) => setVerifyForm({ ...verifyForm, paymentStatus: e.target.value })}
            >
              <option value="completed">Payment Settled (Cash/UPI Transferred)</option>
              <option value="pending">Payment Pending (Net 7 Days Settlement)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Handover Quality Remarks</label>
            <textarea
              rows="2"
              className="form-textarea"
              placeholder="e.g. Components match description, negligible contamination."
              value={verifyForm.notes}
              onChange={(e) => setVerifyForm({ ...verifyForm, notes: e.target.value })}
            />
          </div>

          {/* Interactive Settlement Summary Box */}
          <div style={{
            backgroundColor: 'var(--color-brand-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-brand-200)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Agreed Unit Price:</span>
              <strong>{formatINR(selectedTx?.finalRatePerKg)} / kg</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>Verified Scale Weight:</span>
              <strong>{formatWeight(weightInput)}</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-brand-200)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-900)' }}>Final Transaction Payout:</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
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