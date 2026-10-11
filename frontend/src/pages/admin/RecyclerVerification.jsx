import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatDate } from '../../utils/formatters';

const RecyclerVerification = () => {
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verification action modal state
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState('verify'); // 'verify' or 'revoke'
  const [updating, setUpdating] = useState(false);

  const fetchRecyclers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      if (res.data?.success) {
        setRecyclers(res.data.data.filter((u) => u.role === 'recycler'));
      }
    } catch (err) {
      console.error('Error fetching recyclers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecyclers();
  }, []);

  const handleOpenActionModal = (recycler, type) => {
    setSelectedRecycler(recycler);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirmVerification = async () => {
    if (!selectedRecycler) return;
    setUpdating(true);

    try {
      const isVerified = actionType === 'verify';
      const res = await API.put(`/admin/verify-recycler/${selectedRecycler._id}`, { isVerified });

      if (res.data?.success) {
        setModalOpen(false);
        fetchRecyclers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update recycler status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout title="Recycler Verification & Compliance">
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-surface-subtle)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          🛡️ <strong>Regulatory Guardrail:</strong> Unverified recyclers are restricted from submitting quotations until their State Pollution Control Board (SPCB) authorization and GST credentials have been verified.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading recycler applications..." />
      ) : recyclers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No recycler accounts registered on the platform yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Company / Name</th>
                <th>License & GST</th>
                <th>Contact Details</th>
                <th>Accepted Materials</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recyclers.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>
                      {r.recyclerDetails?.companyName || r.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Contact: {r.name}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      Lic: <code>{r.recyclerDetails?.licenseNumber || 'N/A'}</code>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      GST: <code>{r.recyclerDetails?.gstNumber || 'N/A'}</code>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{r.email}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{r.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {r.address?.city}, {r.address?.state}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', maxWidth: '220px' }}>
                      {r.recyclerDetails?.authorizedCategories?.length > 0 ? (
                        r.recyclerDetails.authorizedCategories.map((c) => (
                          <span
                            key={c}
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: 'var(--color-surface-muted)',
                              padding: '0.15rem 0.4rem',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>None specified</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: r.isVerified ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                      color: r.isVerified ? 'var(--color-success-text)' : 'var(--color-warning-text)'
                    }}>
                      ● {r.isVerified ? 'Verified' : 'Pending Audit'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {formatDate(r.createdAt)}
                  </td>
                  <td>
                    {!r.isVerified ? (
                      <button
                        type="button"
                        onClick={() => handleOpenActionModal(r, 'verify')}
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Approve & Verify
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenActionModal(r, 'revoke')}
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={actionType === 'verify' ? 'Approve Recycler Authorization' : 'Revoke Verification'}
        confirmText={actionType === 'verify' ? 'Approve Recycler' : 'Revoke Credentials'}
        isDanger={actionType === 'revoke'}
        onConfirm={handleConfirmVerification}
        isLoading={updating}
      >
        <p>
          Are you sure you want to {actionType === 'verify' ? 'approve' : 'revoke'} compliance verification for{' '}
          <strong>{selectedRecycler?.recyclerDetails?.companyName || selectedRecycler?.name}</strong>?
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          {actionType === 'verify'
            ? 'This will enable the recycler to place formal bids and coordinate physical pickups on all matching listings.'
            : 'Revoking will immediately halt the recycler from placing new price bids on available lots.'}
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default RecyclerVerification;