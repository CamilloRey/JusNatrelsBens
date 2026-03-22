/**
 * Email Logger & Monitoring
 * Track email delivery and errors
 */

import { supabase } from '@/lib/supabase'

export interface EmailLog {
  id?: string
  event_type: 'sent' | 'delivered' | 'failed' | 'bounced' | 'opened'
  email_address: string
  email_type: 'reset_password' | 'confirm_email' | 'invite'
  status: 'success' | 'error'
  message: string
  error_details?: string
  metadata?: Record<string, any>
  created_at?: string
}

export interface EmailEvent {
  type: 'sent' | 'delivered' | 'failed' | 'bounced' | 'opened'
  email: string
  emailType: 'reset_password' | 'confirm_email' | 'invite'
  message: string
  error?: string
}

/**
 * Log email event
 */
export async function logEmailEvent(event: EmailEvent): Promise<void> {
  try {
    const { error } = await supabase
      .from('email_logs')
      .insert({
        event_type: event.type,
        email_address: event.email,
        email_type: event.emailType,
        status: event.error ? 'error' : 'success',
        message: event.message,
        error_details: event.error || null,
      })

    if (error) {
      console.error('Error logging email event:', error)
    }
  } catch (err) {
    console.error('Failed to log email event:', err)
  }
}

/**
 * Log password reset request
 */
export async function logPasswordResetRequest(email: string, success: boolean, error?: string): Promise<void> {
  await logEmailEvent({
    type: 'sent',
    email,
    emailType: 'reset_password',
    message: success ? 'Password reset email sent' : 'Password reset email failed',
    error: error || undefined,
  })
}

/**
 * Log password reset success
 */
export async function logPasswordResetSuccess(email: string): Promise<void> {
  await logEmailEvent({
    type: 'delivered',
    email,
    emailType: 'reset_password',
    message: 'Password successfully reset',
  })
}

/**
 * Log email confirmation sent
 */
export async function logEmailConfirmation(email: string, success: boolean, error?: string): Promise<void> {
  await logEmailEvent({
    type: 'sent',
    email,
    emailType: 'confirm_email',
    message: success ? 'Confirmation email sent' : 'Confirmation email failed',
    error: error || undefined,
  })
}

/**
 * Get email logs for user
 */
export async function getUserEmailLogs(email: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('email_address', email)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching email logs:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

/**
 * Get email delivery statistics
 */
export async function getEmailStats(days = 7) {
  try {
    const date = new Date()
    date.setDate(date.getDate() - days)

    const { data, error } = await supabase
      .from('email_logs')
      .select('event_type, status, count(*)')
      .gte('created_at', date.toISOString())
      .group_by('event_type', 'status')

    if (error) {
      console.error('Error fetching email stats:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Error:', err)
    return null
  }
}

/**
 * Check email delivery status
 */
export async function checkEmailDeliveryStatus(email: string, emailType: string) {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('email_address', email)
      .eq('email_type', emailType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error checking delivery status:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Error:', err)
    return null
  }
}

/**
 * Get failed emails for admin review
 */
export async function getFailedEmails(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('status', 'error')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching failed emails:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error:', err)
    return []
  }
}

/**
 * Retry failed email
 */
export async function retryFailedEmail(logId: string) {
  try {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .eq('id', logId)
      .single()

    if (error) {
      console.error('Error fetching email log:', error)
      return false
    }

    // Re-send email based on type
    if (data.email_type === 'reset_password') {
      // Call resetPassword function again
      console.log('Retry sending password reset to:', data.email_address)
      return true
    }

    return false
  } catch (err) {
    console.error('Error retrying email:', err)
    return false
  }
}
