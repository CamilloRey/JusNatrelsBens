/**
 * Password Expiry Policy
 * Enforces password rotation and expiry
 */

export interface PasswordPolicy {
  maxAgeDays: number; // Force change after N days
  warningDays: number; // Warn N days before expiry
  minLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number; // Can't reuse last N passwords
}

// Default policy
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  maxAgeDays: 90,
  warningDays: 14,
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  preventReuse: 5,
};

/**
 * Check if password is expired
 */
export function isPasswordExpired(lastChangedDate: string, policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY): boolean {
  const changed = new Date(lastChangedDate);
  const now = new Date();
  const daysSinceChange = (now.getTime() - changed.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceChange > policy.maxAgeDays;
}

/**
 * Get days until password expires
 */
export function daysUntilExpiry(lastChangedDate: string, policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY): number {
  const changed = new Date(lastChangedDate);
  const now = new Date();
  const daysSinceChange = (now.getTime() - changed.getTime()) / (1000 * 60 * 60 * 24);
  const daysRemaining = policy.maxAgeDays - daysSinceChange;

  return Math.max(0, Math.ceil(daysRemaining));
}

/**
 * Should show password expiry warning
 */
export function shouldWarnPasswordExpiry(lastChangedDate: string, policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY): boolean {
  const daysRemaining = daysUntilExpiry(lastChangedDate, policy);
  return daysRemaining > 0 && daysRemaining <= policy.warningDays;
}

/**
 * Validate password against policy
 */
export function validatePasswordPolicy(password: string, policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < policy.minLength) {
    errors.push(`Minimum ${policy.minLength} caractères requis`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Au moins une lettre majuscule requise');
  }

  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Au moins un chiffre requis');
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Au moins un caractère spécial requis');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Store password hash history (for prevent reuse check)
 */
export async function storePasswordHistory(userId: string, passwordHash: string, policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY) {
  const key = `password_history_${userId}`;
  const stored = localStorage.getItem(key);
  let history: string[] = stored ? JSON.parse(stored) : [];

  // Add new password
  history.unshift(passwordHash);

  // Keep only last N passwords
  history = history.slice(0, policy.preventReuse);

  localStorage.setItem(key, JSON.stringify(history));
}

/**
 * Check if password was previously used
 */
export async function wasPasswordUsedBefore(userId: string, passwordHash: string): Promise<boolean> {
  const key = `password_history_${userId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return false;

  const history: string[] = JSON.parse(stored);
  return history.includes(passwordHash);
}

/**
 * Generate secure random password
 */
export function generateSecurePassword(policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{};\':"|,./<>?';

  let chars = lowercase;
  if (policy.requireUppercase) chars += uppercase;
  if (policy.requireNumbers) chars += numbers;
  if (policy.requireSpecialChars) chars += special;

  let password = '';
  for (let i = 0; i < policy.minLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Password expiry warning banner
 */
export interface PasswordExpiryWarning {
  isExpired: boolean;
  willExpireSoon: boolean;
  daysRemaining: number;
  message: string;
  actionRequired: boolean;
}

export function getPasswordExpiryWarning(
  lastChangedDate: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): PasswordExpiryWarning {
  const isExpired = isPasswordExpired(lastChangedDate, policy);
  const daysRemaining = daysUntilExpiry(lastChangedDate, policy);
  const willExpireSoon = shouldWarnPasswordExpiry(lastChangedDate, policy);

  if (isExpired) {
    return {
      isExpired: true,
      willExpireSoon: false,
      daysRemaining: 0,
      message: 'Votre mot de passe a expiré. Veuillez le réinitialiser immédiatement.',
      actionRequired: true,
    };
  }

  if (willExpireSoon) {
    return {
      isExpired: false,
      willExpireSoon: true,
      daysRemaining,
      message: `Votre mot de passe expirera dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}. Réinitialisez-le bientôt.`,
      actionRequired: true,
    };
  }

  return {
    isExpired: false,
    willExpireSoon: false,
    daysRemaining,
    message: '',
    actionRequired: false,
  };
}
