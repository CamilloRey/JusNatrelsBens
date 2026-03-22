import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSupabaseAuth } from '@/features/auth/context/SupabaseAuthContext';

interface ProtectedCheckoutProps {
  children: React.ReactNode;
  allowGuest?: boolean; // Allow guest checkout with email
}

/**
 * Protects checkout route
 * - If allowGuest: guests can checkout with email
 * - If !allowGuest: requires authentication
 */
export function ProtectedCheckout({ children, allowGuest = true }: ProtectedCheckoutProps) {
  const { cart } = useCart();
  const { user } = useSupabaseAuth();

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return <Navigate to="/products" replace />;
  }

  // If guest checkout not allowed, require auth
  if (!allowGuest && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

export function ProtectedCart({ children }: { children: React.ReactNode }) {
  // Empty cart is OK, just show empty state
  return <>{children}</>;
}
