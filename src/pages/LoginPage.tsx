import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { LoginForm } from '@features/auth/ui/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Si ya está logueado, redirigir al destino (si lo había) o al home
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo =
        (location.state as { from?: string } | null)?.from ?? ROUTES.HOME;
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Mensaje contextual si venía de checkout
  const cameFromCheckout =
    (location.state as { from?: string } | null)?.from === ROUTES.CHECKOUT;

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-heading">Mesoquick</h1>
          <p className="text-text/50 mt-2 text-sm">
            {cameFromCheckout
              ? 'Iniciá sesión para completar tu pedido'
              : 'Bienvenido de nuevo, iniciá sesión'}
          </p>
        </div>

        {/* Card con el formulario */}
        <div className="bg-bg-elevated border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-text-heading font-bold text-xl mb-6">
            Iniciar sesión
          </h2>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}