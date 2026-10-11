import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const AllListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/listings');
        if (res.data?.success) setListings(res.data.data);
      } catch (err) {
        console.error('Error fetching admin listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllListings();
  }, []);

  const filtered = listings.filter((l) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.collector?.name?.toLowerCase().includes(q) ||
      l.collector?.phone?.toLowerCase().includes(q);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && l.status === statusFilter;
  });

  return (
    <DashboardLayout title="Material Listings Platform Audit">
      {/* Header Controls */}
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
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--gray-100)', padding: '0.3rem', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
          {['all', 'pending', 'quoted', 'accepted', 'completed'].map((st) => (
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
              {st === 'all' ? `All (${listings.length})` : st}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search lot title, category, collector..."
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
        <LoadingSpinner message="Auditing material lots across aggregators..." />
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
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No listings found</div>
          <div style={{ fontSize: '0.85rem' }}>No material lots match the selected filters.</div>
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
                  <th>Material Lot</th>
                  <th>Category</th>
                  <th>Collector Origin</th>
                  <th>Estimated Weight</th>
                  <th>Condition</th>
                  <th>Benchmark Value</th>
                  <th>Auction Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{item.title}</div>
                      {item.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--gray-100)',
                          color: 'var(--gray-800)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{item.collector?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {item.collector?.phone}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                      {formatWeight(item.estimatedWeight)}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-700)', textTransform: 'capitalize' }}>
                        {item.condition || 'Mixed'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                      {formatINR(item.estimatedTotalValue)}
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                      {formatDate(item.createdAt)}
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

export default AllListings;