/**
 * Monitoring & Logging Service
 * Tracks user actions, errors, and performance
 */

import { supabase } from './supabase';

export interface LogEvent {
  type: 'auth' | 'order' | 'error' | 'security' | 'performance';
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

class MonitoringService {
  private batchQueue: LogEvent[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_DELAY = 5000; // 5 seconds

  /**
   * Log event
   */
  async log(event: LogEvent) {
    this.batchQueue.push({
      ...event,
      metadata: {
        ...event.metadata,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      },
    });

    // Flush if batch full
    if (this.batchQueue.length >= this.BATCH_SIZE) {
      await this.flush();
    } else if (!this.batchTimeout) {
      // Schedule flush
      this.batchTimeout = setTimeout(() => this.flush(), this.BATCH_DELAY);
    }
  }

  /**
   * Flush batch to database
   */
  private async flush() {
    if (this.batchQueue.length === 0) return;

    const events = this.batchQueue.splice(0, this.BATCH_SIZE);
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      await supabase.from('audit_logs').insert(
        events.map((e) => ({
          event_type: e.type,
          action: e.action,
          user_id: e.userId,
          metadata: e.metadata,
          severity: e.severity || 'info',
          created_at: new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error('Logging error:', error);
      // Re-add to queue on failure
      this.batchQueue.unshift(...events);
    }
  }

  /**
   * Log authentication event
   */
  async logAuth(action: string, userId?: string, success: boolean = true) {
    await this.log({
      type: 'auth',
      action,
      userId,
      severity: success ? 'info' : 'warning',
      metadata: {
        success,
        ip: await this.getClientIP(),
      },
    });
  }

  /**
   * Log security event
   */
  async logSecurity(action: string, userId?: string, severity: 'warning' | 'critical' = 'warning') {
    await this.log({
      type: 'security',
      action,
      userId,
      severity,
      metadata: {
        ip: await this.getClientIP(),
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Log order event
   */
  async logOrder(action: string, orderId: string, userId?: string) {
    await this.log({
      type: 'order',
      action,
      userId,
      metadata: {
        orderId,
      },
    });
  }

  /**
   * Log error
   */
  async logError(error: Error, context?: string, userId?: string) {
    await this.log({
      type: 'error',
      action: error.message,
      userId,
      severity: 'error',
      metadata: {
        message: error.message,
        stack: error.stack,
        context,
      },
    });
  }

  /**
   * Track performance metrics
   */
  async trackPerformance(metric: string, duration: number, userId?: string) {
    await this.log({
      type: 'performance',
      action: metric,
      userId,
      metadata: {
        duration,
        threshold: duration > 3000 ? 'slow' : 'normal',
      },
    });
  }

  /**
   * Get client IP (requires backend)
   */
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Flush remaining logs before unload
   */
  flushSync() {
    if (this.batchQueue.length > 0) {
      // Use beacon API for best effort delivery
      const data = JSON.stringify(this.batchQueue);
      navigator.sendBeacon('/api/logs', data);
    }
  }
}

export const monitoring = new MonitoringService();

// Auto-flush on page unload
window.addEventListener('beforeunload', () => {
  monitoring.flushSync();
});

/**
 * React hook for monitoring
 */
export function useMonitoring() {
  return monitoring;
}
