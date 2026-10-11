const LoadingSpinner = ({ message = 'Synchronizing platform records...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        gap: '1.25rem',
        minHeight: '240px'
      }}
    >
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        {/* Ambient background glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            filter: 'blur(8px)'
          }}
        />
        {/* Spinning track ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3.5px solid rgba(16, 185, 129, 0.15)'
          }}
        />
        {/* Spinning indicator */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3.5px solid transparent',
            borderTopColor: '#059669',
            borderRightColor: '#10b981',
            animation: 'spinLoader 0.75s cubic-bezier(0.5, 0, 0.5, 1) infinite'
          }}
        />
        {/* Center eco dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            boxShadow: '0 0 10px #10b981'
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            color: 'var(--color-text-primary)',
            fontSize: '0.94rem',
            fontWeight: 600,
            marginBottom: '0.2rem'
          }}
        >
          {message}
        </p>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          Securing e-waste ledger & verify status
        </span>
      </div>

      <style>{`
        @keyframes spinLoader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;