import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { MATERIAL_CATEGORIES } from '../../utils/constants';
import { formatINR, formatWeight } from '../../utils/formatters';

const AvailableLots = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Quotation Modal state
  const [selectedLot, setSelectedLot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [quoteForm, setQuoteForm] = useState({
    offeredPricePerKg: '',
    pickupDate: '',
    message: ''
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/recycler/listings');
      if (res.data?.success) setListings(res.data.data);
    } catch (err) {
      console.error('Error fetching available lots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleOpenQuoteModal = (lot) => {
    setSelectedLot(lot);
    setQuoteForm({
      offeredPricePerKg: lot.referencePricePerKg || '',
      pickupDate: '',
      message: ''
    });
    setModalOpen(true);
  };

  const handleSubmitQuote = async () => {
    if (!quoteForm.offeredPricePerKg || Number(quoteForm.offeredPricePerKg) <= 0) {
      alert('Please enter a valid price per kg');
      return;
    }
    if (!quoteForm.pickupDate) {
      alert('Please specify an estimated pickup date');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/recycler/quote', {
        listingId: selectedLot._id,
        offeredPricePerKg: Number(quoteForm.offeredPricePerKg),
        pickupDate: quoteForm.pickupDate,
        message: quoteForm.message
      });

      if (res.data?.success) {
        setModalOpen(false);
        alert('Quotation submitted successfully to the collector!');
        fetchListings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quote');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = listings.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  // Calculation for quote modal
  const offeredPriceNum = parseFloat(quoteForm.offeredPricePerKg) || 0;
  const estimatedTotalBid = offeredPriceNum * (selectedLot?.estimatedWeight || 0);

  return (
    <DashboardLayout title="Available E-Waste Material Lots">
      {/* Category Filter Chips */}
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setCategoryFilter('all')}
          style={{
            padding: '0.4rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: categoryFilter === 'all' ? 'var(--primary-600)' : 'var(--gray-300)',
            backgroundColor: categoryFilter === 'all' ? 'var(--primary-600)' : '#ffffff',
            color: categoryFilter === 'all' ? '#ffffff' : 'var(--gray-700)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          All Categories ({listings.length})
        </button>
        {MATERIAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: categoryFilter === cat ? 'var(--primary-600)' : 'var(--gray-300)',
              backgroundColor: categoryFilter === cat ? 'var(--primary-600)' : '#ffffff',
              color: categoryFilter === cat ? '#ffffff' : 'var(--gray-700)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Scanning regional aggregators for available scrap lots..." />
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No open lots available</div>
          <div style={{ fontSize: '0.85rem' }}>No segregated scrap lots listed in this category at this moment.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((lot) => (
            <div
              key={lot._id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--gray-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                e.currentTarget.style.borderColor = 'var(--gray-200)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary-800)',
                      backgroundColor: 'var(--primary-50)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--primary-100)'
                    }}
                  >
                    {lot.category}
                  </span>
                  <StatusBadge status={lot.status} />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.35rem' }}>
                  {lot.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '1.25rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    {lot.pickupAddress?.city || 'Regional'}, {lot.pickupAddress?.state || ''}
                  </span>
                </div>

                {/* Key Spec Capsule */}
                <div
                  style={{
                    backgroundColor: 'var(--gray-50)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-200)',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <span style={{ color: 'var(--gray-500)' }}>Estimated Weight:</span>
                    <strong style={{ color: 'var(--gray-900)' }}>{formatWeight(lot.estimatedWeight)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <span style={{ color: 'var(--gray-500)' }}>Condition Grade:</span>
                    <strong style={{ color: 'var(--gray-900)', textTransform: 'capitalize' }}>{lot.condition || 'Mixed'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.45rem', borderTop: '1px solid var(--gray-200)' }}>
                    <span style={{ color: 'var(--gray-500)' }}>Benchmark Spot Rate:</span>
                    <strong style={{ color: 'var(--primary-700)' }}>{formatINR(lot.referencePricePerKg)} / kg</strong>
                  </div>
                </div>

                {lot.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: '1.25rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                    &quot;{lot.description}&quot;
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenQuoteModal(lot)}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.88rem', padding: '0.55rem 1rem' }}
              >
                Place Spot Bid →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quote Submission Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Quotation for ${selectedLot?.title}`}
        confirmText="Submit Binding Quotation"
        onConfirm={handleSubmitQuote}
        isLoading={submitting}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Offered Bid Price (₹ Per KG) *</label>
            <input
              type="number"
              step="1"
              min="1"
              className="form-input"
              value={quoteForm.offeredPricePerKg}
              onChange={(e) => setQuoteForm({ ...quoteForm, offeredPricePerKg: e.target.value })}
              placeholder="e.g. 180"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Proposed Pickup Date *</label>
            <input
              type="date"
              className="form-input"
              value={quoteForm.pickupDate}
              onChange={(e) => setQuoteForm({ ...quoteForm, pickupDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Special Transport / Packaging Terms (Optional)</label>
            <textarea
              rows="2"
              className="form-textarea"
              placeholder="e.g. Weigh-in with digital truck scale. Cash/IMPS settlement upon loading."
              value={quoteForm.message}
              onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
            />
          </div>

          {/* Real-time Bid Calculation Box */}
          <div
            style={{
              backgroundColor: 'var(--primary-50)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-800)', fontWeight: 600 }}>
                Estimated Total Handover Payout
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
                Based on {formatWeight(selectedLot?.estimatedWeight || 0)}
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              {formatINR(estimatedTotalBid)}
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AvailableLots;