import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../utils/api';
import { formatINR, formatWeight, formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTx, setSearchTx] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, transRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/transactions')
        ]);

        if (statsRes.data?.success) setStats(statsRes.data.data);
        if (transRes.data?.success) setRecentTransactions(transRes.data.data.slice(0, 6));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve administrative data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const filteredTransactions = recentTransactions.filter((tx) => {
    const q = searchTx.toLowerCase();
    return (
      tx.receiptId?.toLowerCase().includes(q) ||
      tx.collector?.name?.toLowerCase().includes(q) ||
      tx.recycler?.name?.toLowerCase().includes(q) ||
      tx.recycler?.recyclerDetails?.companyName?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <DashboardLayout title="Admin Command Center">
        <LoadingSpinner message="Aggregating platform metrics & SPCB audit logs..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Platform Operations Overview"
      actions={
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link
            to="/admin/recyclers"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Review Licenses
          </Link>
          <Link
            to="/admin/transactions"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
            Full Audit Ledger
          </Link>
        </div>
      }
    >
      {/* Live System Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
              display: 'inline-block'
            }}
          />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              Central Pollution Control Board (CPCB) Regulatory Sync Active
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
              All transactions generate immutable chain-of-custody digital manifests
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.82rem' }}>
          <div>
            <span style={{ color: 'var(--gray-500)' }}>Verified Recyclers: </span>
            <strong style={{ color: 'var(--gray-900)' }}>{stats?.totalRecyclers || 0} Facilities</strong>
          </div>
          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--gray-200)' }} />
          <div>
            <span style={{ color: 'var(--gray-500)' }}>Aggregator Network: </span>
            <strong style={{ color: 'var(--gray-900)' }}>{stats?.totalCollectors || 0} Units</strong>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            padding: '0.9rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #fecaca',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Enterprise Metric Cards Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Recycled E-Waste"
          value={formatWeight(stats?.totalWeightRecycledKg || 0)}
          subtext="Verified physical intake"
          trend="Certified"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0 0-1.8L17 9" />
              <path d="M13 3.4a1.8 1.8 0 0 0-1.6-.9 1.8 1.8 0 0 0-1.6.9L7 8" />
              <path d="m14 14 3 3 3-3" />
              <path d="m5 10 3-3 3 3" />
            </svg>
          }
        />
        <StatCard
          title="Gross Payout Volume"
          value={formatINR(stats?.totalTransactionVolumeINR || 0)}
          subtext="Direct bank transfers"
          trend="+18.4% MoM"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <StatCard
          title="Registered Collectors"
          value={stats?.totalCollectors || 0}
          subtext="Aggregators & scrap yards"
          trend="Active"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          title="Partner Recyclers"
          value={stats?.totalRecyclers || 0}
          subtext="Authorized smelters & plants"
          trend="SPCB Compliant"
          trendPositive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
              <path d="M9 9v.01" />
              <path d="M9 12v.01" />
              <path d="M9 15v.01" />
              <path d="M9 18v.01" />
            </svg>
          }
        />
      </div>

      {/* Main Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Left Column: Recent Settlements Table */}
        <div style={{ gridColumn: 'span 2' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-xs)',
              overflow: 'hidden'
            }}
          >
            {/* Table Header with Search */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--gray-200)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>
                  Recent Settlement Manifests
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: '0.2rem 0 0' }}>
                  Audited material exchanges between informal collectors and authorized recyclers
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search receipt, user..."
                    value={searchTx}
                    onChange={(e) => setSearchTx(e.target.value)}
                    style={{
                      padding: '0.4rem 0.75rem 0.4rem 2rem',
                      fontSize: '0.82rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--gray-300)',
                      backgroundColor: 'var(--gray-50)',
                      outline: 'none',
                      width: '200px'
                    }}
                  />
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gray-400)"
                    strokeWidth="2"
                    style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                <Link
                  to="/admin/transactions"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--primary-700)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  View All →
                </Link>
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--gray-500)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                <div style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.25rem' }}>No settlement records found</div>
                <div style={{ fontSize: '0.85rem' }}>Platform transactions will appear here as soon as material pickups complete.</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Receipt</th>
                      <th>Collector</th>
                      <th>Recycler</th>
                      <th>Weight</th>
                      <th>Settled Value</th>
                      <th>Compliance</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx._id}>
                        <td>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              color: 'var(--gray-800)',
                              backgroundColor: 'var(--gray-100)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-sm)'
                            }}
                          >
                            {tx.receiptId}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{tx.collector?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{tx.collector?.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                            {tx.recycler?.recyclerDetails?.companyName || tx.recycler?.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>Authorized Recycler</div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                          {tx.verifiedWeight ? formatWeight(tx.verifiedWeight) : 'Pending Scale'}
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.92rem' }}>
                            {tx.finalAmount ? formatINR(tx.finalAmount) : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={tx.transactionStatus} />
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                          {formatDate(tx.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Platform Governance & Quick Audits */}
        <div>
          {/* Quick Hub Navigation */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '1.5rem'
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '1.25rem' }}>
              Governance Modules
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <Link
                to="/admin/recyclers"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  backgroundColor: 'var(--gray-50)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                  e.currentTarget.style.borderColor = 'var(--gray-200)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                      Recycler Verification
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Audit SPCB licenses & GST</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>→</span>
              </Link>

              <Link
                to="/admin/listings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  backgroundColor: 'var(--gray-50)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                  e.currentTarget.style.borderColor = 'var(--gray-200)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                      Material Lot Registry
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Monitor live e-waste auctions</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>→</span>
              </Link>

              <Link
                to="/admin/users"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  backgroundColor: 'var(--gray-50)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = 'var(--primary-400)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                  e.currentTarget.style.borderColor = 'var(--gray-200)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#f5f3ff',
                      color: '#6d28d9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                      User Directory
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Permissions & KYC verification</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>→</span>
              </Link>
            </div>
          </div>

          {/* Environmental Compliance Metric Widget */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
              E-Waste Stream Breakdown
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '1.25rem' }}>
              Indicative material recovery volume across platform
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                { label: 'Printed Circuit Boards (PCBs)', pct: 38, color: 'var(--primary-600)' },
                { label: 'Copper Cables & Harnesses', pct: 26, color: '#3b82f6' },
                { label: 'Laptops & Office IT Assets', pct: 20, color: '#f59e0b' },
                { label: 'Lithium & Lead Batteries', pct: 16, color: '#ef4444' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--gray-700)', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: 'var(--gray-900)', fontWeight: 800 }}>{item.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--gray-100)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.pct}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;