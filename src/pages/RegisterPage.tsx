
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { RegisterForm } from '@features/auth/ui/RegisterForm';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Si ya está logueado, redirige a pedidos
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ORDERS, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-heading">
            Mesoquick
          </h1>
          <p className="text-text/50 mt-2 text-sm">
            Crea tu cuenta para empezar a pedir
          </p>
        </div>

        {/* Card con el formulario */}
        <div className="bg-bg border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-text-heading font-bold text-xl mb-6">
            Crear cuenta
          </h2>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}