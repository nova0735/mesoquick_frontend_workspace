import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@features/auth/model/useAuthStore';
import { ROUTES } from '@app/router/routes';

/**
 * RegisterPage
 *
 * Form de registro de cliente. Destino del botón "Soy Cliente" del shell-login
 * y también accesible directo. Usa `register()` del store, que internamente
 * llama al broker real (rol=1 cliente) y deja la sesión activa.
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    defaultAddress: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (localError) setLocalError(null);
      if (error) clearError();
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (form.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setLocalError('Correo electrónico inválido.');
      return;
    }

    await register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      defaultAddress: form.defaultAddress.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    const currentError = useAuthStore.getState().error;
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!currentError && isAuth) {
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  const displayError = localError ?? error;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-lg bg-bg-elevated border border-border rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-text-heading mb-2">
            Crear cuenta de cliente
          </h1>
          <p className="text-sm text-text/70">
            Regístrate para empezar a hacer pedidos en Mesoquick.
          </p>
        </div>

        {displayError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Nombre completo"
            type="text"
            value={form.name}
            onChange={update('name')}
            required
            autoComplete="name"
          />

          <Field
            label="Correo electrónico"
            type="email"
            value={form.email}
            onChange={update('email')}
            required
            autoComplete="email"
          />

          <Field
            label="Teléfono"
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            required
            autoComplete="tel"
            placeholder="55512345"
          />

          <Field
            label="Dirección de entrega"
            as="textarea"
            value={form.defaultAddress}
            onChange={update('defaultAddress')}
            required
            rows={2}
            placeholder="Calle, número, zona, referencias..."
          />

          <Field
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={update('password')}
            required
            autoComplete="new-password"
            minLength={6}
          />

          <Field
            label="Confirmar contraseña"
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            required
            autoComplete="new-password"
            minLength={6}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text/70">
          ¿Ya tienes cuenta?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-accent font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Campo de formulario reutilizable ───────────────────────────────────────

type BaseFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type InputFieldProps = BaseFieldProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    as?: 'input';
  };

type TextareaFieldProps = BaseFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> & {
    as: 'textarea';
  };

type FieldProps = InputFieldProps | TextareaFieldProps;

function Field(props: FieldProps) {
  const { label, value, onChange, as = 'input', ...rest } = props;
  const commonClass =
    'mt-1 block w-full px-3 py-2 rounded-md border border-border bg-bg text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm';

  return (
    <label className="block">
      <span className="block text-sm font-medium text-text-heading">{label}</span>
      {as === 'textarea' ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          value={value}
          onChange={onChange}
          className={commonClass}
        />
      ) : (
        <input
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          value={value}
          onChange={onChange}
          className={commonClass}
        />
      )}
    </label>
  );
}