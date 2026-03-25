import { HelmetProvider } from 'react-helmet-async';
import { DataProvider } from './DataContext';
import { AuthProvider } from './AuthContext';
import { SupabaseAuthProvider } from '@/features/auth/context/SupabaseAuthContext';
import { CartProvider } from '@/features/shop/context/CartContext';
import { ToastProvider } from '@/features/shop/context/ToastContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <DataProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </DataProvider>
    </HelmetProvider>
  );
}
