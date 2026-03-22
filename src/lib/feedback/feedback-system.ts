// User Feedback Collection & Analytics System

import { supabase } from '@/lib/supabase'

export interface UserFeedback {
  id: string
  userId: string
  email: string
  type: 'bug' | 'feature' | 'improvement' | 'general'
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  message: string
  page: string
  userAgent: string
  createdAt: string
  resolved: boolean
}

export interface FeedbackMetrics {
  totalFeedback: number
  avgRating: number
  byType: Record<string, number>
  bugCount: number
  featureCount: number
  improvementCount: number
  satisfactionRate: number
}

// Submit feedback
export async function submitFeedback(
  feedback: Omit<UserFeedback, 'id' | 'createdAt'>
): Promise<boolean> {
  try {
    const newFeedback: UserFeedback = {
      ...feedback,
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    const { error } = await supabase.from('user_feedback').insert([newFeedback])

    if (error) throw error

    // Log to analytics
    logAnalytics('feedback_submitted', {
      type: feedback.type,
      rating: feedback.rating,
    })

    return true
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return false
  }
}

// Get feedback metrics
export async function getFeedbackMetrics(): Promise<FeedbackMetrics | null> {
  try {
    const { data, error } = await supabase.from('user_feedback').select('*')

    if (error) throw error

    const feedback = data || []
    const avgRating =
      feedback.length > 0
        ? feedback.reduce((sum: any, f: any) => sum + f.rating, 0) / feedback.length
        : 0

    const byType: Record<string, number> = {
      bug: 0,
      feature: 0,
      improvement: 0,
      general: 0,
    }

    feedback.forEach((f: any) => {
      byType[f.type]++
    })

    const satisfactionRate =
      feedback.length > 0
        ? ((feedback.filter((f: any) => f.rating >= 4).length / feedback.length) * 100)
        : 0

    return {
      totalFeedback: feedback.length,
      avgRating,
      byType,
      bugCount: byType.bug,
      featureCount: byType.feature,
      improvementCount: byType.improvement,
      satisfactionRate,
    }
  } catch (error) {
    console.error('Error getting feedback metrics:', error)
    return null
  }
}

// Get unresolved feedback
export async function getUnresolvedFeedback(): Promise<UserFeedback[]> {
  try {
    const { data, error } = await supabase
      .from('user_feedback')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting unresolved feedback:', error)
    return []
  }
}

// Mark feedback as resolved
export async function resolveFeedback(feedbackId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_feedback')
      .update({ resolved: true })
      .eq('id', feedbackId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error resolving feedback:', error)
    return false
  }
}

// Analytics logging
export function logAnalytics(event: string, properties: Record<string, any> = {}) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties)
    }
  } catch (error) {
    console.error('Error logging analytics:', error)
  }
}

// Track user engagement
export function trackPageView(page: string) {
  logAnalytics('page_view', { page })
}

// Track feature usage
export function trackFeatureUsage(feature: string) {
  logAnalytics('feature_used', { feature })
}

// Track errors
export function trackError(error: string, context: string) {
  logAnalytics('error_occurred', { error, context })
}

// Track conversions
export function trackConversion(conversionType: string, value?: number) {
  logAnalytics('conversion', { type: conversionType, value: value || 0 })
}

// Get analytics dashboard data
export async function getAnalyticsDashboard() {
  try {
    const feedback = await getFeedbackMetrics()

    // Could add more analytics here from other sources
    return {
      feedback,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error getting analytics dashboard:', error)
    return null
  }
}

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
