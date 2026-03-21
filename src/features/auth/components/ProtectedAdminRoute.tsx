import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isAdmin, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Vérification des permissions...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>🔒 Accès refusé</p>
        <p style={{ color: '#666' }}>
          Vous n'avez pas les permissions pour accéder à cette page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
