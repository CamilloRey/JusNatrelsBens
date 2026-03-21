import { HelmetProvider } from 'react-helmet-async';
import { DataProvider } from './DataContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from '@/features/shop/context/CartContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <DataProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </DataProvider>
    </HelmetProvider>
  );
}
