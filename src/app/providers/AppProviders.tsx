import { HelmetProvider } from 'react-helmet-async';
import { DataProvider } from './DataContext';
import { AuthProvider } from './AuthContext';
import { SupabaseAuthProvider } from '@/features/auth/context/SupabaseAuthContext';
import { CartProvider } from '@/features/shop/context/CartContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <DataProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </DataProvider>
    </HelmetProvider>
  );
}
