import { DataProvider } from './DataContext';
import { AuthProvider } from './AuthContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </DataProvider>
  );
}
