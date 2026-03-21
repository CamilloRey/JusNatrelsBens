// Square Web Payments SDK Integration
// https://developer.squareup.com/docs/web-payments/overview

export interface SquareConfig {
  applicationId: string;
  locationId: string;
}

export interface PaymentRequest {
  amount: number; // in cents
  currency: string;
  description: string;
  referenceId?: string;
  customerId?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  receiptUrl?: string;
  error?: string;
}

class SquareClient {
  private applicationId: string = '';
  private locationId: string = '';
  private web: any = null;

  async initialize(config: SquareConfig): Promise<void> {
    this.applicationId = config.applicationId;
    this.locationId = config.locationId;

    // Load Square Web Payments SDK
    if (!window.Square) {
      const script = document.createElement('script');
      script.src = 'https://web.squarecdn.com/v1/square.js';
      script.async = true;
      document.head.appendChild(script);

      // Wait for script to load
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    this.web = window.Square;
  }

  async requestCardPayment(
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    try {
      if (!this.web) {
        throw new Error('Square SDK not initialized');
      }

      // Create payment request for Web Payments Form
      const paymentRequest = {
        requestShippingAddress: false,
        requestBillingInfo: true,
        currencyCode: request.currency || 'CAD',
        countryCode: 'CA',
        total: {
          amount: String(request.amount),
          label: request.description,
          pending: false,
        },
      };

      // Note: Full implementation would include:
      // 1. Web Payments Form initialization
      // 2. Card tokenization
      // 3. Payment processing through backend

      return {
        success: false,
        error: 'Square payment processing requires backend integration',
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  }

  async getPayments(
    locationId: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      // This would call your backend API
      // which uses Square's Payments API
      const response = await fetch(`/api/square/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId, limit }),
      });

      if (!response.ok) throw new Error('Failed to fetch payments');
      return await response.json();
    } catch (error) {
      console.error('Failed to get payments:', error);
      return [];
    }
  }

  async getCustomers(): Promise<any[]> {
    try {
      const response = await fetch(`/api/square/customers`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch customers');
      return await response.json();
    } catch (error) {
      console.error('Failed to get customers:', error);
      return [];
    }
  }

  async createPaymentLink(
    request: PaymentRequest
  ): Promise<{ url: string } | null> {
    try {
      const response = await fetch(`/api/square/payment-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: request.amount,
          description: request.description,
          currency: request.currency || 'CAD',
          referenceId: request.referenceId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create payment link');
      return await response.json();
    } catch (error) {
      console.error('Failed to create payment link:', error);
      return null;
    }
  }

  async refund(
    paymentId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(`/api/square/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      const data = await response.json();
      return {
        success: true,
        transactionId: data.refundId,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  }
}

// Export singleton instance
export const squareClient = new SquareClient();

// Extend Window interface for Square SDK
declare global {
  interface Window {
    Square?: any;
  }
}
