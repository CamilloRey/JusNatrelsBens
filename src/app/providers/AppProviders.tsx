import { HelmetProvider } from 'react-helmet-async';
import { DataProvider } from './DataContext';
import { AuthProvider } from './AuthContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <DataProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </DataProvider>
    </HelmetProvider>
  );
}
