import React, { useState } from 'react';
import { useResetPasswordStore } from '../model/reset.store';

/**
 * COMPONENTE DE UI: Formulario de Restablecimiento de Contraseña
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Refactorizado para consumir su propio Store (Model) de Zustand aislado en la 
 * feature de reset-password, extrayendo la lógica asíncrona fuera del componente.
 */
export const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const { isLoading, isSuccess, error, requestReset } = useResetPasswordStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Llamamos a la acción de Zustand, el Store se encarga del manejo de errores
    await requestReset(email);
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center p-4 bg-green-50 rounded border border-green-200">
        <p className="text-green-600 font-medium">
          Te hemos enviado un enlace al correo.
        </p>
        <p className="text-sm text-green-500 mt-2">
          Por favor revisa tu bandeja de entrada o carpeta de spam.
        </p>
      </div>
    );
  }

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
        {isLoading ? 'Enviando...' : 'Recuperar Contraseña'}
      </button>
    </form>
  );
};