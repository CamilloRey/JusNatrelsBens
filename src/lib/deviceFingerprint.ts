/**
 * Device Fingerprinting
 * Creates unique identifier for devices to detect unauthorized access
 */

export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  platform: string;
  cookiesEnabled: boolean;
  timestamp: string;
}

/**
 * Generate device fingerprint
 */
export async function generateDeviceFingerprint(): Promise<DeviceFingerprint> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Browser Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Browser Fingerprint', 4, 17);
  }

  const canvasFingerprint = canvas.toDataURL();
  const fingerprint: DeviceFingerprint = {
    id: await generateFingerprintHash({
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      canvas: canvasFingerprint,
    }),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    timestamp: new Date().toISOString(),
  };

  return fingerprint;
}

/**
 * Generate hash from fingerprint data
 */
async function generateFingerprintHash(data: Record<string, any>): Promise<string> {
  const str = JSON.stringify(data);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Store device fingerprint
 */
export async function storeDeviceFingerprint(fingerprint: DeviceFingerprint, userId: string) {
  const stored = localStorage.getItem(`device_fingerprint_${userId}`);

  if (!stored) {
    localStorage.setItem(`device_fingerprint_${userId}`, JSON.stringify(fingerprint));
    return { isNew: true };
  }

  const oldFingerprint: DeviceFingerprint = JSON.parse(stored);

  // Check if fingerprint matches
  const isSameDevice = fingerprint.id === oldFingerprint.id;

  if (!isSameDevice) {
    // Different device - flag as potential security issue
    return {
      isNew: false,
      isSameDevice: false,
      warning: 'New device detected',
    };
  }

  // Update timestamp
  localStorage.setItem(`device_fingerprint_${userId}`, JSON.stringify(fingerprint));

  return {
    isNew: false,
    isSameDevice: true,
  };
}

/**
 * Verify device
 */
export async function verifyDevice(userId: string): Promise<boolean> {
  const stored = localStorage.getItem(`device_fingerprint_${userId}`);
  if (!stored) return false;

  const currentFingerprint = await generateDeviceFingerprint();
  const storedFingerprint: DeviceFingerprint = JSON.parse(stored);

  return currentFingerprint.id === storedFingerprint.id;
}

/**
 * Clear device fingerprint
 */
export function clearDeviceFingerprint(userId: string) {
  localStorage.removeItem(`device_fingerprint_${userId}`);
}
