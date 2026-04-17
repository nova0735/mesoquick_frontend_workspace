import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useSessionStore } from '../../../entities/session';
import { zodFormResolver } from '../../../shared/lib/zodFormResolver';
import {
  InvalidCredentialsError,
  mockLogin,
  MOCK_AGENT_CREDENTIALS,
} from '../api/mockLogin';
import { loginSchema, type LoginFormValues } from '../model/loginSchema';

/**
 * Formulario de inicio de sesión en modo DEV MOCK.
 * Cuando llegue el backend, este componente se elimina completo y el login
 * pasa a vivir en @mesoquick/shell-login.
 */
export function MockLoginForm() {
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodFormResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    try {
      const response = await mockLogin(values);
      setSession(response);
      navigate('/inbox', { replace: true });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError('Ocurrió un error inesperado. Intenta de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-primary mb-1"
        >
          Correo corporativo
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="agente@mesoquick.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-primary mb-1"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-base text-white font-semibold rounded-lg hover:bg-green-bright disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </>
        )}
      </button>

      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold text-accent">Modo DEV MOCK:</span>{' '}
          usa{' '}
          <code className="px-1 py-0.5 bg-gray-100 rounded text-primary">
            {MOCK_AGENT_CREDENTIALS.email}
          </code>{' '}
          /{' '}
          <code className="px-1 py-0.5 bg-gray-100 rounded text-primary">
            {MOCK_AGENT_CREDENTIALS.password}
          </code>
          .
        </p>
      </div>
    </form>
  );
}
