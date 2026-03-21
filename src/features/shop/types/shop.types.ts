export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  format?: string;
  img: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  taxRate: number;
  taxes: number;
  shippingCost: number;
  total: number;
}

export type DeliveryType = 'pickup' | 'local' | 'canada';

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: ShippingAddress[];
  createdAt: string;
  lastOrderAt?: string;
}

export interface Order {
  id: string;
  orderId: string; // Friendly ID like ORD-2024-001
  customerId?: string; // Optional if guest checkout
  guestEmail?: string; // For guest orders
  items: CartItem[];
  subtotal: number;
  taxes: number;
  shippingCost: number;
  shippingAddress: ShippingAddress;
  deliveryType: DeliveryType;
  total: number;
  paymentId?: string; // Square payment ID
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingProvider?: string; // Purolator, Canada Post, etc.
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface DeliveryOption {
  type: DeliveryType;
  label: string;
  description: string;
  cost: number;
  estimatedDays: string;
  regions: string[];
}

export interface CheckoutState {
  step: 1 | 2 | 3 | 4; // 1=cart, 2=customer, 3=shipping, 4=payment
  cart: Cart;
  customer?: Partial<CustomerProfile>;
  isGuest: boolean;
  selectedDeliveryType?: DeliveryType;
}
