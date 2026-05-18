import { Navigate } from 'react-router-dom';
import { EditProfileForm } from '@features/auth';
import { useAuthStore } from '@features/auth';
import { ROUTES } from '@app/router/routes';

/**
 * Página dedicada a editar el perfil del usuario.
 * Si no hay sesión activa, redirige al registro.
 */
export default function EditProfilePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.REGISTER} replace />;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <EditProfileForm />
    </main>
  );
}