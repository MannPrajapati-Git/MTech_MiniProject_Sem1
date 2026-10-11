const StatCard = ({ title, value, subtext, icon, trend, trendPositive = true }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--gray-200)',
        padding: '1.5rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden'
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
      {/* Top subtle border accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--primary-600) 0%, var(--primary-400) 100%)'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--gray-500)'
          }}
        >
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              border: '1px solid var(--primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: 'var(--gray-900)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '0.5rem'
          }}
        >
          {value}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {trend && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: trendPositive ? 'var(--primary-50)' : '#fef2f2',
                color: trendPositive ? 'var(--primary-800)' : '#991b1b',
                border: `1px solid ${trendPositive ? 'var(--primary-200)' : '#fecaca'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              {trendPositive ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtext && (
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500 }}>
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;