import React, { useState } from 'react';
import { requestPasswordReset } from '../api/reset.api';

/**
 * COMPONENTE DE UI: Formulario de Restablecimiento de Contraseña
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Este componente es un gran ejemplo de "aislamiento de estado". A diferencia 
 * del `LoginForm`, este formulario NO toca ni importa el `useAuthStore` global 
 * de Zustand. Administra su propio estado local (`email`, `isLoading`, `isSuccess`, 
 * `error`) porque la acción de solicitar un reseteo no afecta la sesión actual del 
 * cliente en la memoria.
 */
export const ResetPasswordForm: React.FC = () => {
  // Estados locales para controlar el ciclo de vida del formulario
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitamos que la página se recargue
    setIsLoading(true);
    setError(null); // Limpiamos errores previos en cada nuevo intento

    try {
      // Llamamos a nuestra capa de API aislada
      await requestPasswordReset(email);
      // ÉXITO: Cambiamos la vista para mostrar el mensaje de confirmación
      setIsSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // ERROR: Extraemos el mensaje del backend o mostramos uno por defecto
      setError(err?.response?.data?.message || err.message || 'Error al solicitar el enlace. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado Condicional: Si fue exitoso, ocultamos el input y botón.
  if (isSuccess) {
    return (
      <div className="w-full text-center p-4 bg-green-50 rounded border border-green-200">
        <p className="text-green-600 font-medium">
          Se ha enviado un enlace de recuperación a tu correo.
        </p>
        <p className="text-sm text-green-500 mt-2">
          Por favor revisa tu bandeja de entrada o carpeta de spam.
        </p>
      </div>
    );
  }

  // Vista por defecto: Formulario de solicitud
  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
      
      <div className="mb-6">
        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56bd64]"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !email}
        className="bg-[#56bd64] hover:bg-[#37e64f] text-white font-semibold w-full py-2 rounded transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
      </button>
    </form>
  );
};