import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatDate } from '../../utils/formatters';

const RecyclerVerification = () => {
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'verified', 'pending'

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

  const filteredRecyclers = recyclers.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recyclerDetails?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recyclerDetails?.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recyclerDetails?.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'verified') return matchesSearch && r.isVerified;
    if (filterStatus === 'pending') return matchesSearch && !r.isVerified;
    return matchesSearch;
  });

  const pendingCount = recyclers.filter((r) => !r.isVerified).length;
  const verifiedCount = recyclers.filter((r) => r.isVerified).length;

  return (
    <DashboardLayout title="Recycler Verification & Compliance Audit">
      {/* Regulatory Guardrail Banner */}
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--gray-900)', margin: '0 0 0.2rem' }}>
            Central & State Pollution Control Board Regulatory Guardrail
          </h4>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
            Under E-Waste Management Rules, unverified recyclers are legally restricted from submitting price quotations or procuring scrap until their State Pollution Control Board (SPCB) authorization and GSTIN credentials have been manually inspected and approved below.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
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
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterStatus === 'all' ? '#ffffff' : 'transparent',
              color: filterStatus === 'all' ? 'var(--gray-900)' : 'var(--gray-500)',
              boxShadow: filterStatus === 'all' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            All Recyclers ({recyclers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterStatus === 'pending' ? '#ffffff' : 'transparent',
              color: filterStatus === 'pending' ? '#b45309' : 'var(--gray-500)',
              boxShadow: filterStatus === 'pending' ? 'var(--shadow-xs)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
          >
            Pending Review
            {pendingCount > 0 && (
              <span
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontWeight: 800
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('verified')}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterStatus === 'verified' ? '#ffffff' : 'transparent',
              color: filterStatus === 'verified' ? 'var(--primary-800)' : 'var(--gray-500)',
              boxShadow: filterStatus === 'verified' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Verified ({verifiedCount})
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search company, license, GST, city..."
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
        <LoadingSpinner message="Auditing recycler applications..." />
      ) : filteredRecyclers.length === 0 ? (
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No recyclers found</div>
          <div style={{ fontSize: '0.85rem' }}>No matching recycler profiles under the current filter.</div>
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
                  <th>Facility / Enterprise</th>
                  <th>License & GSTIN</th>
                  <th>Contact Info</th>
                  <th>Permitted Streams</th>
                  <th>Compliance Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Audit Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecyclers.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>
                        {r.recyclerDetails?.companyName || r.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                        Representative: {r.name}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Lic: </span>
                        <code style={{ fontSize: '0.78rem', backgroundColor: 'var(--gray-100)', padding: '0.15rem 0.35rem', borderRadius: 'var(--radius-sm)' }}>
                          {r.recyclerDetails?.licenseNumber || 'Not provided'}
                        </code>
                      </div>
                      <div style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        <span style={{ color: 'var(--gray-500)' }}>GST: </span>
                        <code style={{ fontSize: '0.78rem', backgroundColor: 'var(--gray-100)', padding: '0.15rem 0.35rem', borderRadius: 'var(--radius-sm)' }}>
                          {r.recyclerDetails?.gstNumber || 'Not provided'}
                        </code>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'var(--gray-900)' }}>{r.email}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{r.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                        {r.address?.city ? `${r.address.city}, ${r.address.state || ''}` : 'Location pending'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', maxWidth: '200px' }}>
                        {r.recyclerDetails?.authorizedCategories?.length > 0 ? (
                          r.recyclerDetails.authorizedCategories.map((c) => (
                            <span
                              key={c}
                              style={{
                                fontSize: '0.72rem',
                                backgroundColor: 'var(--gray-100)',
                                color: 'var(--gray-700)',
                                padding: '0.15rem 0.4rem',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              {c}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>None listed</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: r.isVerified ? 'var(--primary-50)' : '#fffbeb',
                          color: r.isVerified ? 'var(--primary-800)' : '#92400e',
                          border: `1px solid ${r.isVerified ? 'var(--primary-200)' : '#fde68a'}`
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: r.isVerified ? '#10b981' : '#f59e0b'
                          }}
                        />
                        {r.isVerified ? 'SPCB Approved' : 'Audit Pending'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                      {formatDate(r.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {!r.isVerified ? (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(r, 'verify')}
                          className="btn btn-primary"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            borderRadius: 'var(--radius-sm)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Approve Recycler
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(r, 'revoke')}
                          className="btn btn-danger"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            borderRadius: 'var(--radius-sm)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={actionType === 'verify' ? 'Approve Recycler Authorization' : 'Revoke Verification'}
        confirmText={actionType === 'verify' ? 'Confirm Approval' : 'Revoke Access'}
        isDanger={actionType === 'revoke'}
        onConfirm={handleConfirmVerification}
        isLoading={updating}
      >
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.92rem', color: 'var(--gray-800)' }}>
          Are you sure you want to {actionType === 'verify' ? 'approve' : 'revoke'} compliance credentials for{' '}
          <strong>{selectedRecycler?.recyclerDetails?.companyName || selectedRecycler?.name}</strong>?
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', margin: 0, lineHeight: 1.5 }}>
          {actionType === 'verify'
            ? 'This activates the enterprise account to place competitive bids and schedule pickups across all listings.'
            : 'Revoking will immediately suspend the recycler from placing new price bids on active lots.'}
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default RecyclerVerification;