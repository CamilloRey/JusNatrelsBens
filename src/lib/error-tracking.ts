/**
 * Error Tracking & Monitoring
 * Track application errors for debugging and monitoring
 */

import { supabase } from '@/lib/supabase'

export interface ErrorEvent {
  type: string
  message: string
  stack?: string
  endpoint?: string
  method?: string
  severity?: 'info' | 'warning' | 'error' | 'critical'
  metadata?: Record<string, any>
}

/**
 * Log error event
 */
export async function logError(error: ErrorEvent): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('error_logs').insert({
      error_type: error.type,
      error_message: error.message,
      error_stack: error.stack || null,
      user_id: user?.id || null,
      endpoint: error.endpoint || null,
      method: error.method || null,
      severity: error.severity || 'error',
      metadata: error.metadata || {},
    })

    if (insertError) {
      console.error('Failed to log error:', insertError)
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${error.severity || 'error'}] ${error.type}:`, error.message)
      if (error.stack) console.error(error.stack)
    }
  } catch (err) {
    console.error('Error tracking failed:', err)
  }
}

/**
 * Log authentication error
 */
export async function logAuthError(email: string, eventType: string, errorMessage: string): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from('auth_audit_log').insert({
      user_id: user?.id || null,
      email,
      event_type: eventType,
      success: false,
      error_message: errorMessage,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    })
  } catch (err) {
    console.error('Failed to log auth error:', err)
  }
}

/**
 * Log authentication success
 */
export async function logAuthSuccess(email: string, eventType: string): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from('auth_audit_log').insert({
      user_id: user?.id || null,
      email,
      event_type: eventType,
      success: true,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    })
  } catch (err) {
    console.error('Failed to log auth success:', err)
  }
}

/**
 * Get recent errors
 */
export async function getRecentErrors(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching error logs:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

/**
 * Get unresolved errors
 */
export async function getUnresolvedErrors(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching unresolved errors:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

/**
 * Get errors by severity
 */
export async function getErrorsBySeverity(severity: 'info' | 'warning' | 'error' | 'critical', limit = 50) {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .eq('severity', severity)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching errors by severity:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

/**
 * Mark error as resolved
 */
export async function markErrorResolved(errorId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('error_logs')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', errorId)

    if (error) {
      console.error('Error marking error resolved:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Error:', err)
    return false
  }
}

/**
 * Get error statistics
 */
export async function getErrorStatistics(days = 7) {
  try {
    const date = new Date()
    date.setDate(date.getDate() - days)

    const { data, error } = await supabase
      .from('error_logs')
      .select('severity')
      .gte('created_at', date.toISOString())

    if (error) {
      console.error('Error fetching error statistics:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Error:', err)
    return null
  }
}

/**
 * Get user auth logs
 */
export async function getUserAuthLogs(userId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('auth_audit_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user auth logs:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

/**
 * Get failed auth attempts
 */
export async function getFailedAuthAttempts(hours = 24) {
  try {
    const date = new Date()
    date.setHours(date.getHours() - hours)

    const { data, error } = await supabase
      .from('auth_audit_log')
      .select('*')
      .eq('success', false)
      .gte('created_at', date.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching failed auth attempts:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

/**
 * Wrap async function with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorType: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      await logError({
        type: errorType,
        message: err.message,
        stack: err.stack,
        metadata: { args },
      })
      throw error
    }
  }) as T
}
