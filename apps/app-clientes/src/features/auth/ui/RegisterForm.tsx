import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { Button } from '@shared/ui';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '../model/useAuthStore';
import { useRegisterForm } from '../model/useRegisterForm';
import { RegisterFormFields } from './RegisterFormFields';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { formData, errors, touched, handleChange, handleBlur, validateAll } =
    useRegisterForm();

  const handleSubmit = async () => {
    clearError();
    const isValid = validateAll();
    if (!isValid) return;

    await register(formData);

    // Si no hubo error en el store, redirigimos al historial
    const currentError = useAuthStore.getState().error;
    if (!currentError) {
      navigate(ROUTES.ORDERS);
    }
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
      <RegisterFormFields
        formData={formData}
        errors={errors}
        touched={touched}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* Botón submit */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-colors"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Crear cuenta
          </>
        )}
      </Button>

      {/* Link a login */}
      <p className="text-center text-sm text-text/60">
        ¿Ya tenés cuenta?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="text-accent font-medium hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}