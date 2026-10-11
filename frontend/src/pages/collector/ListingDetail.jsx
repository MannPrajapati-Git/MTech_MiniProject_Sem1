import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ listing: null, quotes: [] });
  const [error, setError] = useState('');

  // Acceptance Modal state
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/collector/listing/${id}`);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load listing details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleOpenAcceptModal = (quote) => {
    setSelectedQuote(quote);
    setModalOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedQuote) return;
    setAccepting(true);
    try {
      const res = await API.post(`/collector/quote/${selectedQuote._id}/accept`);
      if (res.data?.success) {
        setModalOpen(false);
        navigate('/collector/transactions');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error accepting quotation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Listing Details">
        <LoadingSpinner message="Loading lot & quotation records..." />
      </DashboardLayout>
    );
  }

  const { listing, quotes } = data;

  if (!listing) {
    return (
      <DashboardLayout title="Listing Details">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Listing not found or access unauthorized.</p>
          <Link to="/collector/listings" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Listings
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={listing.title}>
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

      {/* Lot Information Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>{listing.title}</h2>
              <StatusBadge status={listing.status} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Listed on {formatDate(listing.createdAt)} &nbsp;|&nbsp; Category: <strong>{listing.category}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
              Reference Estimated Value
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand-600)' }}>
              {formatINR(listing.estimatedTotalValue)}
            </span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-muted)', margin: '1.25rem 0' }} />

        <div className="grid-3" style={{ fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Estimated Weight:</span>
            <p style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{formatWeight(listing.estimatedWeight)}</p>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Reference Rate:</span>
            <p style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{formatINR(listing.referencePricePerKg)} / kg</p>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Material Condition:</span>
            <p style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{listing.condition}</p>
          </div>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Pickup Address:</span>
          <p style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {listing.pickupAddress?.street}, {listing.pickupAddress?.city}, {listing.pickupAddress?.state} - {listing.pickupAddress?.pincode}
          </p>
        </div>

        {listing.description && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Notes:</span>
            <p style={{ color: 'var(--color-text-secondary)' }}>{listing.description}</p>
          </div>
        )}
      </div>

      {/* Recycler Quotations Section */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
        Received Quotations ({quotes.length})
      </h3>

      {quotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No authorized recyclers have placed an offer yet. Once a quote is submitted, it will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quotes.map((q) => {
            const isAccepted = q.status === 'accepted';
            const isRejected = q.status === 'rejected';

            return (
              <div
                key={q._id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: isAccepted ? '4px solid var(--color-brand-600)' : '1px solid var(--color-border-default)',
                  opacity: isRejected ? 0.6 : 1
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem' }}>
                      {q.recycler?.recyclerDetails?.companyName || q.recycler?.name}
                    </h4>
                    {q.recycler?.isVerified && (
                      <span style={{
                        backgroundColor: 'var(--color-success-bg)',
                        color: 'var(--color-success-text)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                    Estimated Pickup: <strong>{formatDate(q.pickupDate)}</strong> &nbsp;|&nbsp; Recycler Phone: {q.recycler?.phone}
                  </div>

                  {q.message && (
                    <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                      "{q.message}"
                    </p>
                  )}
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-brand-700)' }}>
                      {formatINR(q.offeredPricePerKg)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}> / kg</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Est. Total: {formatINR(q.totalOfferedPrice)}
                    </div>
                  </div>

                  {listing.status !== 'accepted' && listing.status !== 'completed' && !isRejected && (
                    <button
                      type="button"
                      onClick={() => handleOpenAcceptModal(q)}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    >
                      Accept Deal
                    </button>
                  )}

                  {isAccepted && (
                    <span style={{ color: 'var(--color-brand-700)', fontWeight: 700, fontSize: '0.85rem' }}>
                      ✓ Accepted Offer
                    </span>
                  )}
                  {isRejected && (
                    <span style={{ color: 'var(--color-danger-text)', fontSize: '0.8rem' }}>
                      Offer Closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Deal Acceptance"
        confirmText="Confirm & Schedule Pickup"
        onConfirm={handleConfirmAccept}
        isLoading={accepting}
      >
        <p style={{ marginBottom: '1rem' }}>
          Are you sure you want to accept the offer of{' '}
          <strong>{formatINR(selectedQuote?.offeredPricePerKg)}/kg</strong> from{' '}
          <strong>{selectedQuote?.recycler?.name}</strong>?
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--gray-600)', backgroundColor: '#fffbeb', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Accepting this offer will reject all other quotations for this lot and generate a formal pickup transaction record.</span>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ListingDetail;