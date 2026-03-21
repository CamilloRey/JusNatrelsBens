/**
 * Email Service
 * Uses Supabase Edge Functions to send emails
 */

interface EmailTemplate {
  template: 'order_confirmation' | 'order_shipped' | 'order_delivered' | 'password_reset' | 'mfa_setup' | 'security_alert';
  to: string;
  data: Record<string, any>;
}

export async function sendEmail(email: EmailTemplate) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': localStorage.getItem('csrf_token') || '',
      },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { error };
  }
}

/**
 * Email Templates
 */
export const emailTemplates = {
  orderConfirmation: (
    email: string,
    orderId: string,
    total: number,
    items: any[]
  ) => ({
    template: 'order_confirmation' as const,
    to: email,
    data: {
      orderId,
      total: (total / 100).toFixed(2),
      items,
      confirmLink: `${window.location.origin}/order/${orderId}`,
    },
  }),

  orderShipped: (
    email: string,
    orderId: string,
    trackingNumber: string,
    carrier: string
  ) => ({
    template: 'order_shipped' as const,
    to: email,
    data: {
      orderId,
      trackingNumber,
      carrier,
      trackingLink: `https://www.${carrier.toLowerCase()}.com/track/${trackingNumber}`,
    },
  }),

  orderDelivered: (
    email: string,
    orderId: string,
    deliveryDate: string
  ) => ({
    template: 'order_delivered' as const,
    to: email,
    data: {
      orderId,
      deliveryDate,
      feedbackLink: `${window.location.origin}/feedback/${orderId}`,
    },
  }),

  passwordReset: (
    email: string,
    resetLink: string
  ) => ({
    template: 'password_reset' as const,
    to: email,
    data: {
      resetLink,
      expiresIn: '24 heures',
    },
  }),

  mfaSetup: (
    email: string,
    userName: string
  ) => ({
    template: 'mfa_setup' as const,
    to: email,
    data: {
      userName,
      timestamp: new Date().toLocaleString('fr-CA'),
    },
  }),

  securityAlert: (
    email: string,
    alertType: 'login' | 'password_change' | 'mfa_disabled',
    details: any
  ) => ({
    template: 'security_alert' as const,
    to: email,
    data: {
      alertType,
      timestamp: new Date().toLocaleString('fr-CA'),
      ipAddress: details.ipAddress,
      location: details.location,
      ...details,
    },
  }),
};

/**
 * Audit logging for email sends
 */
export async function logEmailSent(
  email: string,
  template: string,
  userId?: string
) {
  try {
    const response = await fetch('/api/log-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        template,
        userId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Email logging error:', error);
    return false;
  }
}
