const statusConfig = {
  // Listings
  pending: {
    label: 'Pending Bids',
    bg: '#fffbeb',
    text: '#92400e',
    border: '#fde68a',
    pulseColor: '#f59e0b'
  },
  quoted: {
    label: 'Quotes Received',
    bg: '#ecfeff',
    text: '#0e7490',
    border: '#a5f3fc',
    pulseColor: '#06b6d4'
  },
  accepted: {
    label: 'Deal Confirmed',
    bg: '#ecfdf5',
    text: '#065f46',
    border: '#a7f3d0',
    pulseColor: '#10b981'
  },
  completed: {
    label: 'Material Settled',
    bg: '#f0fdf4',
    text: '#166534',
    border: '#bbf7d0',
    pulseColor: '#22c55e'
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#fef2f2',
    text: '#991b1b',
    border: '#fecaca',
    pulseColor: '#ef4444'
  },

  // Verification
  verified: {
    label: 'SPCB Verified',
    bg: '#ecfdf5',
    text: '#065f46',
    border: '#6ee7b7',
    pulseColor: '#10b981'
  },
  unverified: {
    label: 'Pending License Review',
    bg: '#fffbeb',
    text: '#92400e',
    border: '#fde68a',
    pulseColor: '#f59e0b'
  },

  // Transactions / Pickups
  scheduled: {
    label: 'Pickup En Route',
    bg: '#f0f9ff',
    text: '#0369a1',
    border: '#bae6fd',
    pulseColor: '#0284c7'
  },
  picked_up: {
    label: 'Collected at Site',
    bg: '#eff6ff',
    text: '#1d4ed8',
    border: '#bfdbfe',
    pulseColor: '#3b82f6'
  },
  paid: {
    label: 'Paid & Discharged',
    bg: '#ecfdf5',
    text: '#065f46',
    border: '#a7f3d0',
    pulseColor: '#10b981'
  }
};

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();
  const config = statusConfig[normalized] || {
    label: status || 'General',
    bg: '#f1f5f9',
    text: '#475569',
    border: '#cbd5e1',
    pulseColor: '#64748b'
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.3rem 0.8rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.78rem',
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
      }}
    >
      <span
        style={{
          width: '6.5px',
          height: '6.5px',
          borderRadius: '50%',
          backgroundColor: config.pulseColor,
          display: 'inline-block',
          boxShadow: `0 0 6px ${config.pulseColor}`
        }}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;