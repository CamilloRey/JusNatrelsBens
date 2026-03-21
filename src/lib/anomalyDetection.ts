/**
 * Anomaly Detection
 * Detects unusual user behavior patterns
 */

export interface UserBehavior {
  userId: string;
  loginTime: string;
  location: string;
  device: string;
  ipAddress: string;
  userAgent: string;
  actions: Array<{
    type: string; // 'login', 'purchase', 'admin', 'download'
    timestamp: string;
    amount?: number;
    location?: string;
  }>;
}

export interface AnomalyScore {
  overall: number; // 0-100
  factors: {
    unusualTime: number;
    unusualLocation: number;
    unusualDevice: number;
    unusualAmount: number;
    unusualFrequency: number;
    newDevice: number;
  };
  isAnomaly: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actions: string[]; // Recommended actions
}

/**
 * Calculate anomaly score
 */
export function calculateAnomalyScore(
  currentBehavior: Partial<UserBehavior>,
  historicalBehavior: UserBehavior[]
): AnomalyScore {
  const scores = {
    unusualTime: scoreUnusualTime(currentBehavior, historicalBehavior),
    unusualLocation: scoreUnusualLocation(currentBehavior, historicalBehavior),
    unusualDevice: scoreUnusualDevice(currentBehavior, historicalBehavior),
    unusualAmount: scoreUnusualAmount(currentBehavior, historicalBehavior),
    unusualFrequency: scoreUnusualFrequency(currentBehavior, historicalBehavior),
    newDevice: scoreNewDevice(currentBehavior, historicalBehavior),
  };

  const overall = Math.round(
    (Object.values(scores).reduce((a, b) => a + b, 0) / 6) * 100
  );

  const isAnomaly = overall > 60;
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (overall > 80) severity = 'critical';
  else if (overall > 70) severity = 'high';
  else if (overall > 60) severity = 'medium';

  const actions = getRecommendedActions(scores, severity);

  return {
    overall,
    factors: {
      unusualTime: Math.round(scores.unusualTime * 100),
      unusualLocation: Math.round(scores.unusualLocation * 100),
      unusualDevice: Math.round(scores.unusualDevice * 100),
      unusualAmount: Math.round(scores.unusualAmount * 100),
      unusualFrequency: Math.round(scores.unusualFrequency * 100),
      newDevice: Math.round(scores.newDevice * 100),
    },
    isAnomaly,
    severity,
    actions,
  };
}

/**
 * Score: Is login time unusual?
 * (e.g., always 9am-5pm, now 3am)
 */
function scoreUnusualTime(
  current: Partial<UserBehavior>,
  historical: UserBehavior[]
): number {
  if (!current.loginTime || historical.length === 0) return 0;

  const currentHour = new Date(current.loginTime).getHours();

  // Get typical login hours
  const loginHours = historical.map((b) => new Date(b.loginTime).getHours());
  const avgHour =
    loginHours.reduce((a, b) => a + b, 0) / loginHours.length;

  // Standard deviation
  const variance =
    loginHours.reduce((sum, h) => sum + Math.pow(h - avgHour, 2), 0) /
    loginHours.length;
  const stdDev = Math.sqrt(variance);

  // Z-score
  const zScore = Math.abs((currentHour - avgHour) / (stdDev || 1));

  return Math.min(zScore / 3, 1); // Normalize to 0-1
}

/**
 * Score: Is location unusual?
 */
function scoreUnusualLocation(
  current: Partial<UserBehavior>,
  historical: UserBehavior[]
): number {
  if (!current.location || historical.length === 0) return 0;

  // Check if location was seen before
  const seenLocations = new Set(historical.map((b) => b.location));

  if (!seenLocations.has(current.location)) {
    return 0.8; // New location = high anomaly
  }

  return 0.2; // Seen before = low anomaly
}

/**
 * Score: Is device unusual?
 */
function scoreUnusualDevice(
  current: Partial<UserBehavior>,
  historical: UserBehavior[]
): number {
  if (!current.device || historical.length === 0) return 0;

  const seenDevices = new Set(historical.map((b) => b.device));

  if (!seenDevices.has(current.device)) {
    return 0.7; // New device = high anomaly
  }

  return 0.1; // Known device = low anomaly
}

/**
 * Score: Is purchase amount unusual?
 */
function scoreUnusualAmount(
  current: Partial<UserBehavior>,
  historical: UserBehavior[]
): number {
  const currentAmount = current.actions?.[0]?.amount;
  if (!currentAmount || historical.length < 5) return 0;

  // Get historical purchase amounts
  const amounts = historical
    .flatMap((b) => b.actions)
    .filter((a) => a.type === 'purchase')
    .map((a) => a.amount || 0);

  if (amounts.length === 0) return 0;

  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(
    amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) /
      amounts.length
  );

  const zScore = Math.abs((currentAmount - avgAmount) / (stdDev || 1));

  return Math.min(zScore / 3, 1);
}

/**
 * Score: Is frequency unusual?
 */
function scoreUnusualFrequency(
  current: Partial<UserBehavior>,
  historical: UserBehavior[]
): number {
  if (historical.length < 5) return 0;

  // Calculate typical days between activities
  const dates = historical.map((b) => new Date(b.loginTime));
  const intervals: number[] = [];

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i - 1].getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24);
    intervals.push(diff);
  }

  if (intervals.length === 0) return 0;

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  // If user logs in way more frequently = anomaly
  const todayCount = historical.filter(
    (b) =>
      new Date(b.loginTime).toDateString() === new Date().toDateString()
  ).length;

  if (todayCount > 10) return 0.6; // Too many logins today

  return 0.1;
}

/**
 * Score: Is device new?
 */
function scoreNewDevice(
  current: Partial<UserBehavior>,
  historical: UserBehavior[]
): number {
  if (!current.device || historical.length === 0) return 0;

  const knownDevices = new Set(historical.map((b) => b.device));

  return knownDevices.has(current.device) ? 0 : 0.5;
}

/**
 * Get recommended actions
 */
function getRecommendedActions(
  factors: Record<string, number>,
  severity: string
): string[] {
  const actions: string[] = [];

  if (factors.newDevice > 0.5) {
    actions.push('Require email verification');
  }

  if (factors.unusualLocation > 0.6) {
    actions.push('Request location confirmation');
  }

  if (factors.unusualAmount > 0.7) {
    actions.push('Require MFA verification');
  }

  if (factors.unusualFrequency > 0.5) {
    actions.push('Temporary account lock - review required');
  }

  if (severity === 'critical') {
    actions.push('Block access - security review required');
    actions.push('Send security alert email');
  } else if (severity === 'high') {
    actions.push('Require MFA for next action');
    actions.push('Send verification code');
  } else if (severity === 'medium') {
    actions.push('Log activity');
    actions.push('Monitor for further anomalies');
  }

  return actions;
}

/**
 * Store behavior for future analysis
 */
export function storeBehavior(userId: string, behavior: UserBehavior) {
  const key = `behavior_history_${userId}`;
  const stored = localStorage.getItem(key);
  let history: UserBehavior[] = stored ? JSON.parse(stored) : [];

  history.push(behavior);

  // Keep last 100 behaviors (90 days)
  history = history.slice(-100);

  localStorage.setItem(key, JSON.stringify(history));
}

/**
 * Get behavior history
 */
export function getBehaviorHistory(userId: string): UserBehavior[] {
  const key = `behavior_history_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}
