/**
 * Geo-Blocking & IP Restrictions
 * Block access by country, IP address, VPN detection
 */

export interface GeoBlockingConfig {
  blockedCountries: string[]; // ISO country codes: ['KP', 'IR', 'SY']
  whitelist: string[]; // Allowed IP addresses
  vpnDetection: boolean; // Block VPN/Proxy users
  maxGeoChanges: number; // Max location changes per 24h (fraud detection)
}

export const DEFAULT_GEO_CONFIG: GeoBlockingConfig = {
  blockedCountries: [
    // High-risk countries - customize as needed
    'KP', // North Korea
    'IR', // Iran
    'SY', // Syria
    'CU', // Cuba
  ],
  whitelist: [],
  vpnDetection: true,
  maxGeoChanges: 3, // Max 3 different countries in 24h
};

/**
 * Get user's geolocation from IP
 */
export async function getIPGeolocation(ip: string) {
  try {
    // Free service: ip-api.com
    const response = await fetch(`https://ip-api.com/json/${ip}`);
    const data = await response.json();

    if (!data.status || data.status === 'fail') {
      return null;
    }

    return {
      ip: data.query,
      country: data.country,
      countryCode: data.countryCode,
      city: data.city,
      region: data.regionName,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      isVPN: false, // Basic service doesn't detect VPN
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return null;
  }
}

/**
 * Check if user is using VPN/Proxy
 */
export async function detectVPN(ip: string): Promise<boolean> {
  try {
    // Use IPQualityScore API (free tier available)
    const apiKey = import.meta.env.VITE_IPQS_API_KEY || '';

    if (!apiKey) {
      // If no API key, use basic heuristics
      return await basicVPNDetection(ip);
    }

    const response = await fetch(
      `https://ipqualityscore.com/api/json/ip/${ip}?strictness=1&key=${apiKey}`
    );
    const data = await response.json();

    return data.is_vpn || data.is_proxy || data.is_crawler;
  } catch (error) {
    console.error('VPN detection error:', error);
    return false;
  }
}

/**
 * Basic VPN detection using common VPN IP patterns
 */
async function basicVPNDetection(ip: string): Promise<boolean> {
  // Common VPN IP ranges (simplified)
  // In production, use a comprehensive VPN database
  const vpnPatterns = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
  ];

  return vpnPatterns.some((pattern) => pattern.test(ip));
}

/**
 * Check if access is allowed
 */
export async function isAccessAllowed(
  ip: string,
  config: GeoBlockingConfig = DEFAULT_GEO_CONFIG
): Promise<{
  allowed: boolean;
  reason?: string;
  geo?: any;
}> {
  // Check IP whitelist first
  if (config.whitelist.length > 0 && config.whitelist.includes(ip)) {
    return { allowed: true };
  }

  // Get geolocation
  const geo = await getIPGeolocation(ip);

  if (!geo) {
    // Can't determine location - block for safety
    return { allowed: false, reason: 'Unable to verify location' };
  }

  // Check country blocking
  if (config.blockedCountries.includes(geo.countryCode)) {
    return {
      allowed: false,
      reason: `Access blocked from ${geo.country}`,
      geo,
    };
  }

  // Check VPN
  if (config.vpnDetection) {
    const isVPN = await detectVPN(ip);
    if (isVPN) {
      return {
        allowed: false,
        reason: 'VPN/Proxy detected. Please disable to continue.',
        geo,
      };
    }
  }

  return { allowed: true, geo };
}

/**
 * Track user location changes
 */
export interface LocationHistory {
  userId: string;
  locations: Array<{
    country: string;
    city: string;
    timestamp: string;
    ip: string;
  }>;
}

export function storeLocationHistory(
  userId: string,
  geo: any
) {
  const key = `location_history_${userId}`;
  const stored = localStorage.getItem(key);
  let history: LocationHistory = stored
    ? JSON.parse(stored)
    : { userId, locations: [] };

  // Add new location
  history.locations.push({
    country: geo.country,
    city: geo.city,
    timestamp: new Date().toISOString(),
    ip: geo.ip,
  });

  // Keep last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  history.locations = history.locations.filter(
    (loc) => new Date(loc.timestamp) > thirtyDaysAgo
  );

  localStorage.setItem(key, JSON.stringify(history));
  return history;
}

/**
 * Check for suspicious location changes
 */
export function detectSuspiciousLocationChange(
  userId: string,
  currentGeo: any,
  maxChanges: number = 3
): {
  isSuspicious: boolean;
  reason?: string;
  changesInLast24h?: number;
} {
  const key = `location_history_${userId}`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    return { isSuspicious: false };
  }

  const history: LocationHistory = JSON.parse(stored);
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Count location changes in last 24 hours
  const recent = history.locations.filter(
    (loc) => new Date(loc.timestamp) > last24h
  );

  // Get unique countries
  const uniqueCountries = new Set(recent.map((loc) => loc.country));

  if (uniqueCountries.size > maxChanges) {
    return {
      isSuspicious: true,
      reason: `Too many location changes (${uniqueCountries.size} countries in 24h)`,
      changesInLast24h: uniqueCountries.size,
    };
  }

  return { isSuspicious: false, changesInLast24h: uniqueCountries.size };
}
