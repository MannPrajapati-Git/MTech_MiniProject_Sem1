import React, { useState, useEffect } from 'react';
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
    <DashboardLayout title="Available E-Waste Lots">
      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCategoryFilter('all')}
          className="btn"
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.85rem',
            backgroundColor: categoryFilter === 'all' ? 'var(--color-brand-600)' : 'var(--color-surface-base)',
            color: categoryFilter === 'all' ? '#fff' : 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-default)'
          }}
        >
          All Categories
        </button>
        {MATERIAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className="btn"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.85rem',
              backgroundColor: categoryFilter === cat ? 'var(--color-brand-600)' : 'var(--color-surface-base)',
              color: categoryFilter === cat ? '#fff' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-default)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Scanning for newly listed lots..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No material lots currently open in this category.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((lot) => (
            <div key={lot._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-brand-800)',
                    backgroundColor: 'var(--color-brand-100)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {lot.category}
                  </span>
                  <StatusBadge status={lot.status} />
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{lot.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  📍 {lot.pickupAddress?.city}, {lot.pickupAddress?.state}
                </p>

                <div style={{
                  backgroundColor: 'var(--color-surface-subtle)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Estimated Weight:</span>
                    <strong>{formatWeight(lot.estimatedWeight)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Condition:</span>
                    <strong>{lot.condition}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Benchmark Reference:</span>
                    <strong style={{ color: 'var(--color-brand-700)' }}>{formatINR(lot.referencePricePerKg)}/kg</strong>
                  </div>
                </div>

                {lot.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    "{lot.description}"
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenQuoteModal(lot)}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '0.9rem' }}
              >
                Submit Price Quotation
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
        confirmText="Send Quotation to Collector"
        onConfirm={handleSubmitQuote}
        isLoading={submitting}
      >
        <div style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Offered Rate (₹ Per KG) *</label>
            <input
              type="number"
              step="1"
              min="1"
              className="form-input"
              value={quoteForm.offeredPricePerKg}
              onChange={(e) => setQuoteForm({ ...quoteForm, offeredPricePerKg: e.target.value })}
              placeholder="e.g. 160"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Pickup Date *</label>
            <input
              type="date"
              className="form-input"
              value={quoteForm.pickupDate}
              onChange={(e) => setQuoteForm({ ...quoteForm, pickupDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Note / Conditions (Optional)</label>
            <textarea
              rows="2"
              className="form-textarea"
              placeholder="e.g. Price valid if moisture content is minimal upon pickup."
              value={quoteForm.message}
              onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
            />
          </div>

          {/* Live Bid Value Display */}
          <div style={{
            backgroundColor: 'var(--color-brand-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-brand-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-brand-800)', fontWeight: 600 }}>
              Total Estimated Settlement:
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand-800)' }}>
              {formatINR(estimatedTotalBid)}
            </span>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AvailableLots;