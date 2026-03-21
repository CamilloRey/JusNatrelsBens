import { useAdvancedSecurity } from '@/hooks/useAdvancedSecurity';
import { C } from '@/shared/constants/colors';

/**
 * Security Alert Component
 * Shows security status and warnings
 */
export function SecurityAlert() {
  const { geoInfo, anomalyScore, isVPN, securityStatus, loading } = useAdvancedSecurity();

  if (loading) {
    return null; // Don't show while loading
  }

  if (securityStatus === 'safe') {
    return null; // No warning needed
  }

  const isBlocked = securityStatus === 'blocked';
  const isWarning = securityStatus === 'warning';

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 400,
        borderRadius: 12,
        padding: 16,
        border: `2px solid ${isBlocked ? '#dc2626' : '#f97316'}`,
        background: isBlocked ? '#fee2e2' : '#fed7aa',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 24 }}>{isBlocked ? '🚫' : '⚠️'}</div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: 14,
              fontWeight: 700,
              color: isBlocked ? '#991b1b' : '#92400e',
            }}
          >
            {isBlocked ? 'Access Blocked' : 'Security Warning'}
          </h3>

          <div
            style={{
              fontSize: 12,
              color: isBlocked ? '#7f1d1d' : '#78350f',
              lineHeight: 1.5,
            }}
          >
            {isBlocked && (
              <>
                <p style={{ margin: '0 0 4px' }}>
                  🔒 Access denied due to security concerns.
                </p>
                <p style={{ margin: 0 }}>
                  Please contact support if you believe this is a mistake.
                </p>
              </>
            )}

            {isWarning && (
              <>
                {isVPN && (
                  <p style={{ margin: '0 0 4px' }}>
                    📍 VPN/Proxy detected. Some features may be restricted.
                  </p>
                )}

                {anomalyScore > 60 && (
                  <p style={{ margin: '0 0 4px' }}>
                    🚨 Unusual activity detected (Anomaly score: {anomalyScore}%)
                  </p>
                )}

                {geoInfo && (
                  <p style={{ margin: 0 }}>
                    📍 Login from {geoInfo.city}, {geoInfo.country}
                  </p>
                )}

                <p style={{ margin: '4px 0 0', fontSize: 11 }}>
                  Additional verification may be required.
                </p>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => location.reload()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            color: isBlocked ? '#991b1b' : '#92400e',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Inline security status indicator
 */
export function SecurityIndicator() {
  const { securityStatus, anomalyScore, isVPN } = useAdvancedSecurity();

  if (securityStatus === 'safe') {
    return (
      <div
        title="Security status: Safe"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: C.green,
        }}
      >
        🔒 Secure
      </div>
    );
  }

  return (
    <div
      title={`Anomaly score: ${anomalyScore}% ${isVPN ? '(VPN detected)' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: securityStatus === 'blocked' ? '#dc2626' : '#f97316',
      }}
    >
      {securityStatus === 'blocked' ? '🚫' : '⚠️'} {securityStatus === 'blocked' ? 'Blocked' : 'Warning'}
    </div>
  );
}
