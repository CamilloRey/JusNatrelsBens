/**
 * Zero Trust Architecture
 * Trust nothing, verify everything on every request
 */

import { supabase } from './supabase';

export interface TrustContext {
  userId?: string;
  token?: string;
  device?: string;
  location?: string;
  timestamp: string;
  action: string;
  resource: string;
  permissions: string[];
}

export interface TrustVerification {
  trusted: boolean;
  score: number; // 0-100
  reasons: string[];
  requiresAdditionalVerification: boolean;
  blockReason?: string;
}

/**
 * Zero Trust verification pipeline
 */
export async function verifyZeroTrust(
  context: TrustContext
): Promise<TrustVerification> {
  const checks: {
    name: string;
    result: boolean;
    reason: string;
  }[] = [];

  // 1. Verify token validity
  if (!context.token) {
    return {
      trusted: false,
      score: 0,
      reasons: ['No authentication token provided'],
      requiresAdditionalVerification: false,
      blockReason: 'Authentication required',
    };
  }

  const tokenValid = await verifyToken(context.token);
  checks.push({
    name: 'Token Valid',
    result: tokenValid,
    reason: tokenValid ? 'Token is valid' : 'Token is invalid or expired',
  });

  // 2. Verify user identity
  if (!context.userId) {
    return {
      trusted: false,
      score: 0,
      reasons: ['No user ID provided'],
      requiresAdditionalVerification: false,
      blockReason: 'User identification required',
    };
  }

  const userExists = await verifyUserExists(context.userId);
  checks.push({
    name: 'User Exists',
    result: userExists,
    reason: userExists ? 'User found' : 'User not found',
  });

  // 3. Verify user permissions for this action
  const hasPermission = await verifyPermissions(
    context.userId,
    context.action,
    context.resource
  );
  checks.push({
    name: 'Has Permission',
    result: hasPermission,
    reason: hasPermission
      ? `User has permission for ${context.action}`
      : `User lacks permission for ${context.action}`,
  });

  // 4. Verify device trust
  const deviceTrusted = await verifyDeviceTrust(context.userId, context.device);
  checks.push({
    name: 'Device Trusted',
    result: deviceTrusted,
    reason: deviceTrusted ? 'Device is trusted' : 'Device is not trusted',
  });

  // 5. Verify location legitimacy
  const locationLegit = await verifyLocationLegitimacy(
    context.userId,
    context.location
  );
  checks.push({
    name: 'Location Legitimate',
    result: locationLegit,
    reason: locationLegit
      ? 'Location matches user profile'
      : 'Location is unexpected',
  });

  // 6. Verify action is not suspicious
  const actionLegit = await verifyActionLegitimacy(context.userId, context.action);
  checks.push({
    name: 'Action Legitimate',
    result: actionLegit,
    reason: actionLegit
      ? 'Action matches user behavior'
      : 'Action is suspicious',
  });

  // 7. Verify request timing
  const timingLegit = await verifyRequestTiming(context.userId, context.action);
  checks.push({
    name: 'Request Timing',
    result: timingLegit,
    reason: timingLegit ? 'Request timing is normal' : 'Request timing is unusual',
  });

  // Calculate trust score
  const passedChecks = checks.filter((c) => c.result).length;
  const trustScore = Math.round((passedChecks / checks.length) * 100);

  // Build reasons
  const failedReasons = checks
    .filter((c) => !c.result)
    .map((c) => c.reason);

  const isTrusted = trustScore >= 80; // 80%+ required
  const requiresAdditional = trustScore >= 60 && trustScore < 80; // 60-80% = additional verification

  // Log verification
  await logZeroTrustVerification(context, trustScore, isTrusted);

  return {
    trusted: isTrusted,
    score: trustScore,
    reasons: failedReasons,
    requiresAdditionalVerification: requiresAdditional,
    blockReason: !isTrusted ? 'Trust verification failed' : undefined,
  };
}

/**
 * 1. Verify JWT token
 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    return !error && !!data.user;
  } catch {
    return false;
  }
}

/**
 * 2. Verify user exists and is active
 */
async function verifyUserExists(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * 3. Verify user has permission for action
 */
async function verifyPermissions(
  userId: string,
  action: string,
  resource: string
): Promise<boolean> {
  try {
    // Check RLS policies
    const { error } = await supabase
      .from(resource)
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

    if (error) return false;

    // For admin actions, check role
    if (action.startsWith('admin_')) {
      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      return role?.role === 'admin';
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 4. Verify device is trusted
 */
async function verifyDeviceTrust(
  userId: string,
  deviceId?: string
): Promise<boolean> {
  if (!deviceId) return false;

  try {
    const { data } = await supabase
      .from('device_fingerprints')
      .select('is_trusted')
      .eq('user_id', userId)
      .eq('fingerprint_id', deviceId)
      .single();

    return data?.is_trusted === true;
  } catch {
    return false;
  }
}

/**
 * 5. Verify location is legitimate
 */
async function verifyLocationLegitimacy(
  userId: string,
  location?: string
): Promise<boolean> {
  if (!location) return false;

  try {
    const { data } = await supabase
      .from('device_fingerprints')
      .select('id')
      .eq('user_id', userId)
      .ilike('city', location)
      .limit(1);

    return data != null && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * 6. Verify action matches user behavior
 */
async function verifyActionLegitimacy(
  userId: string,
  action: string
): Promise<boolean> {
  try {
    // Check if action type was performed before
    const { data } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('action', action)
      .limit(1);

    return data != null && data.length > 0;
  } catch {
    return true; // If can't verify, allow (new user)
  }
}

/**
 * 7. Verify request timing is normal
 */
async function verifyRequestTiming(
  userId: string,
  action: string
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('audit_logs')
      .select('created_at')
      .eq('user_id', userId)
      .eq('action', action)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!data || data.length === 0) return true;

    // Calculate normal frequency
    const now = new Date();
    const lastAction = new Date(data[0].created_at);
    const timeSinceLastAction = (now.getTime() - lastAction.getTime()) / 1000 / 60; // minutes

    // If less than 1 minute since last same action = suspicious
    if (timeSinceLastAction < 1 && data.length > 3) {
      return false;
    }

    return true;
  } catch {
    return true;
  }
}

/**
 * Log zero trust verification
 */
async function logZeroTrustVerification(
  context: TrustContext,
  score: number,
  trusted: boolean
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      event_type: 'security',
      action: 'zero_trust_verification',
      user_id: context.userId,
      severity: trusted ? 'info' : 'warning',
      metadata: {
        action: context.action,
        resource: context.resource,
        score,
        trusted,
        device: context.device,
        location: context.location,
      },
    });
  } catch (error) {
    console.error('Failed to log zero trust verification:', error);
  }
}

/**
 * Enforce zero trust on sensitive operations
 */
export async function requireZeroTrustVerification(
  context: TrustContext
): Promise<{ allowed: boolean; reason?: string }> {
  const verification = await verifyZeroTrust(context);

  if (!verification.trusted) {
    return {
      allowed: false,
      reason: verification.blockReason,
    };
  }

  if (verification.requiresAdditionalVerification) {
    return {
      allowed: false,
      reason: 'Additional verification required (MFA, email confirmation, etc)',
    };
  }

  return { allowed: true };
}
