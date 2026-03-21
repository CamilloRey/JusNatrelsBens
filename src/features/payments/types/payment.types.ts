export interface SquarePayment {
  id: string;
  squarePaymentId: string;
  orderId?: string;
  customerId?: string;
  amount: number; // in cents
  currency: string; // 'CAD'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  method: 'CARD' | 'CASH' | 'DIGITAL_WALLET'; // CARD = credit/debit, DIGITAL_WALLET = Apple Pay, Google Pay
  description: string;
  receiptUrl?: string;
  refundedAmount?: number;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  notes?: string;
  locationId?: string;
  employeeId?: string; // for POS transactions
}

export interface SquareCustomer {
  id: string;
  squareCustomerId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface SquareSettings {
  id: string;
  squareApplicationId: string;
  squareAccessToken: string;
  squareLocationId: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface PaymentLinkRequest {
  amount: number; // in cents
  description: string;
  currency?: string;
  customerId?: string;
  referenceId?: string;
  expiresAt?: string; // ISO timestamp
}
