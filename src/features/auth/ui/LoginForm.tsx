import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, AlertCircle, Mail, Lock } from 'lucide-react';
import { Input, Button } from '@shared/ui';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '../model/useAuthStore';
import type { LoginFormData, LoginFormErrors } from '../model/auth.types';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});

  /**
   * Después de login exitoso: si veníamos redirigidos de checkout
   * o de otra ruta, volvemos ahí. Sino, vamos al inicio.
   */
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? ROUTES.HOME;

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) clearError();
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await login(formData);

    // Verificar si el login tuvo éxito
    const currentError = useAuthStore.getState().error;
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!currentError && isAuth) {
      navigate(redirectTo, { replace: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Error del servidor */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Campos */}
      <div className="space-y-4" onKeyDown={handleKeyDown}>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="current-password"
        />
      </div>

      {/* Botón submit */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-colors"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </>
        )}
      </Button>

      {/* Link a registro */}
      <p className="text-center text-sm text-text/60">
        ¿No tenés cuenta?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="text-accent font-medium hover:underline"
        >
          Creá una acá
        </Link>
      </p>
    </div>
  );
}