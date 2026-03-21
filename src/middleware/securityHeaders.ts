/**
 * Security Headers & CSRF Protection
 */

export function setupSecurityHeaders() {
  // Add CSRF token to all forms
  const csrfToken = generateCSRFToken();
  localStorage.setItem('csrf_token', csrfToken);

  // Set security headers (when using backend)
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  };

  return headers;
}

export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getCSRFToken(): string {
  return localStorage.getItem('csrf_token') || generateCSRFToken();
}

/**
 * Rate Limiting (Client-side)
 * For server-side: use Express rate-limit
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Clean old attempts
    const recentAttempts = attempts.filter((t) => now - t < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

/**
 * Input Validation & Sanitization
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): boolean {
  // Min 8 chars, 1 uppercase, 1 number
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function sanitizeInput(input: string): string {
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
}

export function validatePostalCode(code: string): boolean {
  // Canadian postal code format: A1A 1A1
  return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(code.toUpperCase());
}

export function validatePhone(phone: string): boolean {
  // North American format
  const phoneRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * XSS Prevention
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Session Management
 */
export class SessionManager {
  private sessionTimeout = 30 * 60 * 1000; // 30 min
  private warningTime = 5 * 60 * 1000; // 5 min warning
  private lastActivity = Date.now();
  private timeoutHandle: NodeJS.Timeout | null = null;
  private warningCallback?: () => void;
  private logoutCallback?: () => void;

  constructor(onWarning?: () => void, onLogout?: () => void) {
    this.warningCallback = onWarning;
    this.logoutCallback = onLogout;
    this.startTracking();
  }

  private startTracking() {
    // Track user activity
    document.addEventListener('click', () => this.updateActivity());
    document.addEventListener('keypress', () => this.updateActivity());
    document.addEventListener('mousemove', () => this.updateActivity());

    this.resetTimer();
  }

  private updateActivity() {
    this.lastActivity = Date.now();
    this.resetTimer();
  }

  private resetTimer() {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

    // Show warning before logout
    this.timeoutHandle = setTimeout(() => {
      this.warningCallback?.();
    }, this.sessionTimeout - this.warningTime);

    // Auto logout after timeout
    setTimeout(() => {
      this.logoutCallback?.();
    }, this.sessionTimeout);
  }

  destroy() {
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
    document.removeEventListener('click', () => this.updateActivity());
    document.removeEventListener('keypress', () => this.updateActivity());
    document.removeEventListener('mousemove', () => this.updateActivity());
  }
}
