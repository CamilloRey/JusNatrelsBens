import { Navigate } from 'react-router-dom';
import { useAuth }  from '@/features/auth/hooks/useAuth';
import { ROUTES }  from '@/shared/constants/routes';

interface Props { children: React.ReactNode; }

export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />;
  return <>{children}</>;
}
