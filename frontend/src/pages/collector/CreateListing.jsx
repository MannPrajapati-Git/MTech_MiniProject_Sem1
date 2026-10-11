import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../utils/api';
import { MATERIAL_CATEGORIES, REFERENCE_RATES, CONDITIONS } from '../../utils/constants';
import { formatINR } from '../../utils/formatters';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: MATERIAL_CATEGORIES[0],
    estimatedWeight: '',
    condition: 'Scrap/Damaged',
    description: '',
    imageUrl: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Live estimated calculation
  const currentRate = REFERENCE_RATES[formData.category] || 50;
  const weightNum = parseFloat(formData.estimatedWeight) || 0;
  const estimatedTotal = weightNum * currentRate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (weightNum <= 0) {
      setError('Please provide a valid weight greater than 0 kg');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        estimatedWeight: weightNum,
        condition: formData.condition,
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        pickupAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      const res = await API.post('/collector/listing', payload);
      if (res.data?.success) {
        navigate('/collector/listings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Material Listing">
      <div style={{ maxWidth: '800px' }}>
        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger-text)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid #f5b8b4'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Material Details</h3>

          <div className="form-group">
            <label className="form-label">Listing Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Mixed Computer Motherboards & Green PCB Scrap"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Material Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                {MATERIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Material Condition *</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="form-select">
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Estimated Weight (in KG) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="estimatedWeight"
                required
                placeholder="e.g. 25.5"
                value={formData.estimatedWeight}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Photo Image Link (Optional)</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/photo.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Interactive Pricing Estimator Pill */}
          <div style={{
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border-strong)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            margin: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                Benchmark Reference Rate
              </span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                {formatINR(currentRate)} / kg
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block' }}>
                Estimated Reference Value
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-brand-600)' }}>
                {formatINR(estimatedTotal)}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Mention details like whether parts are intact, desoldered, stored dry, etc."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <h3 style={{ fontSize: '1.15rem', margin: '1.75rem 0 1rem' }}>Pickup Location</h3>

          <div className="form-group">
            <label className="form-label">Street / Colony Address *</label>
            <input type="text" name="street" required value={formData.street} onChange={handleChange} className="form-input" />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">City *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">State *</label>
              <input type="text" name="state" required value={formData.state} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode *</label>
              <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => navigate('/collector/listings')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing Lot...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateListing;