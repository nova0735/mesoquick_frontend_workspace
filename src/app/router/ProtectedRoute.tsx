import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { ROUTES } from './routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Guard que protege rutas que requieren sesión iniciada.
 * Si no hay sesión, redirige al login y guarda la ruta original
 * para volver a ella después del login exitoso.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}