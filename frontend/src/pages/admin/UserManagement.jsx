import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatDate } from '../../utils/formatters';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/users');
        if (res.data?.success) setUsers(res.data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.address?.city?.toLowerCase().includes(q);

    return matchesRole && matchesSearch;
  });

  return (
    <DashboardLayout title="User Directory & Platform Roles">
      {/* Search & Role Filters */}
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
          {['all', 'collector', 'recycler', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: roleFilter === role ? '#ffffff' : 'transparent',
                color: roleFilter === role ? 'var(--gray-900)' : 'var(--gray-500)',
                boxShadow: roleFilter === role ? 'var(--shadow-xs)' : 'none',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease'
              }}
            >
              {role === 'all' ? `All Users (${users.length})` : `${role}s`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
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
        <LoadingSpinner message="Loading user directory..." />
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>No users found</div>
          <div style={{ fontSize: '0.85rem' }}>No registered accounts match your filter criteria.</div>
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
                  <th>User Profile</th>
                  <th>Role</th>
                  <th>Contact Email</th>
                  <th>Phone Number</th>
                  <th>Operating Location</th>
                  <th>KYC / Verification</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
                  const isRecycler = u.role === 'recycler';
                  const isAdmin = u.role === 'admin';

                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: isAdmin ? '#fee2e2' : isRecycler ? 'var(--primary-100)' : 'var(--gray-100)',
                              color: isAdmin ? '#991b1b' : isRecycler ? 'var(--primary-800)' : 'var(--gray-700)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem'
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{u.name}</div>
                            {isRecycler && u.recyclerDetails?.companyName && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                {u.recyclerDetails.companyName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            backgroundColor:
                              u.role === 'admin'
                                ? '#fee2e2'
                                : u.role === 'recycler'
                                ? 'var(--primary-50)'
                                : 'var(--gray-100)',
                            color:
                              u.role === 'admin'
                                ? '#991b1b'
                                : u.role === 'recycler'
                                ? 'var(--primary-800)'
                                : 'var(--gray-700)',
                            border: `1px solid ${
                              u.role === 'admin'
                                ? '#fecaca'
                                : u.role === 'recycler'
                                ? 'var(--primary-200)'
                                : 'var(--gray-200)'
                            }`
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gray-900)' }}>{u.email}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{u.phone || 'N/A'}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>
                        {u.address?.city ? `${u.address.city}, ${u.address.state || ''}` : 'Not provided'}
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: u.isVerified ? 'var(--primary-700)' : '#b45309'
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: u.isVerified ? '#10b981' : '#f59e0b'
                            }}
                          />
                          {u.isVerified ? 'Verified' : 'Pending Audit'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserManagement;