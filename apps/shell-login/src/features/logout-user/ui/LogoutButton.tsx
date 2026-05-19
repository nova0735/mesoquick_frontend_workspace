import React from 'react';
import { useAuthStore } from '../../../entities/session/model/auth.store';

/**
 * COMPONENTE DE UI: Botón de Cerrar Sesión
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Feature aislada (`features/logout-user`) que consume el store global de la sesión 
 * (`entities/session`) para disparar el logout y redirigir al usuario.
 */
export const LogoutButton: React.FC = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Redireccionamos a la vista de login (o root), forzando una recarga limpia
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
    >
      Cerrar Sesión
    </button>
  );
};