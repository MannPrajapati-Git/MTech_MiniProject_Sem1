import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatDate } from '../../utils/formatters';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');

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
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  return (
    <DashboardLayout title="User Directory & Permissions">
      {/* Role Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'collector', 'recycler', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className="btn"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.85rem',
              textTransform: 'capitalize',
              backgroundColor: roleFilter === role ? 'var(--color-brand-600)' : 'var(--color-surface-base)',
              color: roleFilter === role ? '#fff' : 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-default)'
            }}
          >
            {role === 'all' ? 'All Roles' : `${role}s`}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No registered users found in this category.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>User Full Name</th>
                <th>Platform Role</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Verification</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor:
                        u.role === 'admin'
                          ? '#fee4e2'
                          : u.role === 'recycler'
                          ? 'var(--color-info-bg)'
                          : 'var(--color-brand-100)',
                      color:
                        u.role === 'admin'
                          ? '#b42318'
                          : u.role === 'recycler'
                          ? 'var(--color-info-text)'
                          : 'var(--color-brand-800)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    {u.address?.city ? `${u.address.city}, ${u.address.state || ''}` : 'Not provided'}
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: u.isVerified ? 'var(--color-success-text)' : 'var(--color-warning-text)'
                    }}>
                      {u.isVerified ? '✓ Verified' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserManagement;