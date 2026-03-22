import { useEffect, useState } from 'react';
import { isAccessAllowed, detectVPN, DEFAULT_GEO_CONFIG } from '@/lib/geoBlocking';
import { calculateAnomalyScore, storeBehavior, getBehaviorHistory } from '@/lib/anomalyDetection';
import { verifyZeroTrust, requireZeroTrustVerification } from '@/lib/zeroTrust';
import { useSupabaseAuth } from '@/features/auth/context/SupabaseAuthContext';
import { monitoring } from '@/lib/monitoring';

/**
 * Combined advanced security hook
 */
export function useAdvancedSecurity() {
  const { user, session } = useSupabaseAuth();
  const [userIp, setUserIp] = useState<string | null>(null);
  const [geoInfo, setGeoInfo] = useState<any | null>(null);
  const [anomalyScore, setAnomalyScore] = useState<number>(0);
  const [isVPN, setIsVPN] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<'safe' | 'warning' | 'blocked'>('safe');
  const [loading, setLoading] = useState(true);

  // Initialize security checks on app load
  useEffect(() => {
    if (!user) return;

    const initializeSecurity = async () => {
      try {
        setLoading(true);

        // 1. Get user IP
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        setUserIp(ip);

        // 2. Geo-blocking check
        const geoAccessCheck = await isAccessAllowed(ip, DEFAULT_GEO_CONFIG);
        if (!geoAccessCheck.allowed) {
          setSecurityStatus('blocked');
          monitoring.logSecurity('geo_blocked', user.id, 'warning');
          return;
        }

        setGeoInfo(geoAccessCheck.geo);

        // 3. VPN detection
        const vpnDetected = await detectVPN(ip);
        setIsVPN(vpnDetected);

        if (vpnDetected) {
          monitoring.logSecurity('vpn_detected', user.id, 'warning');
        }

        // 4. Anomaly detection
        const behavior = {
          userId: user.id,
          loginTime: new Date().toISOString(),
          location: geoAccessCheck.geo?.city,
          device: navigator.userAgent.substring(0, 50),
          ipAddress: ip,
          userAgent: navigator.userAgent,
          actions: [],
        };

        const history = getBehaviorHistory(user.id);
        const anomaly = calculateAnomalyScore(behavior, history);
        setAnomalyScore(anomaly.overall);
        storeBehavior(user.id, behavior as any);

        if (anomaly.isAnomaly) {
          const logSev: 'warning' | 'critical' = anomaly.severity === 'critical' ? 'critical' : 'warning';
          monitoring.logSecurity('anomaly_detected', user.id, logSev);
          setSecurityStatus(anomaly.severity === 'critical' ? 'blocked' : 'warning');
        }

        // 5. Zero Trust verification
        if (session) {
          const trustContext = {
            userId: user.id,
            token: session.access_token,
            device: navigator.userAgent,
            location: geoAccessCheck.geo?.city,
            timestamp: new Date().toISOString(),
            action: 'app_access',
            resource: 'app',
            permissions: [],
          };

          const trustVerification = await verifyZeroTrust(trustContext);
          if (!trustVerification.trusted && trustVerification.score < 60) {
            setSecurityStatus('blocked');
            monitoring.logSecurity('zero_trust_failed', user.id, 'critical');
          }
        }
      } catch (error) {
        console.error('Security initialization error:', error);
        monitoring.logError(error as Error, 'security_init', user?.id);
      } finally {
        setLoading(false);
      }
    };

    initializeSecurity();
  }, [user, session]);

  return {
    userIp,
    geoInfo,
    anomalyScore,
    isVPN,
    securityStatus,
    loading,
    isSecure: securityStatus === 'safe' && !loading,
    requiresWarning: securityStatus === 'warning',
    isBlocked: securityStatus === 'blocked',
  };
}

/**
 * Hook for sensitive operations (checkout, admin, etc)
 */
export function useZeroTrustVerification() {
  const { user, session } = useSupabaseAuth();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (action: string, resource: string) => {
    if (!user || !session) {
      setError('Not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await requireZeroTrustVerification({
        userId: user.id,
        token: session.access_token,
        device: navigator.userAgent,
        location: await getLocation(),
        timestamp: new Date().toISOString(),
        action,
        resource,
        permissions: [],
      });

      if (result.allowed) {
        setVerified(true);
        return true;
      } else {
        setError(result.reason || 'Verification failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verify, verified, loading, error };
}

/**
 * Get user location
 */
async function getLocation(): Promise<string> {
  try {
    const response = await fetch('https://ip-api.com/json/');
    const data = await response.json();
    return data.city || 'Unknown';
  } catch {
    return 'Unknown';
  }
}
