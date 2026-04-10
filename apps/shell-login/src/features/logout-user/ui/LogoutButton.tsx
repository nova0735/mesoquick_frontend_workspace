import React, { useState } from 'react';
import { logoutRequest } from '../api/logout.api';
import { useAuthStore } from '../../authenticate-user';

/**
 * COMPONENTE DE UI: Botón de Cierre de Sesión
 * 
 * 🚪 NOTA DE ARQUITECTURA FSD:
 * Este componente maneja la terminación segura de la sesión del usuario.
 * Primero intenta invalidar el token en el servidor (backend).
 * CRÍTICO: Independientemente de si la petición al servidor tiene éxito o falla
 * (por ejemplo, si no hay red), SIEMPRE debemos limpiar el estado del cliente
 * llamando a `useAuthStore.getState().logout()`, lo cual purgará el localStorage
 * y redirigirá al usuario a la pantalla de login.
 */
export const LogoutButton: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Intentamos cerrar la sesión en el backend (invalidar token)
      await logoutRequest();
    } catch (error) {
      // Si el backend falla (ej. red caída, o el token ya expiró en el servidor),
      // lo capturamos silenciosamente, pero NO detenemos el flujo de limpieza local.
      console.warn('Error al cerrar sesión en el servidor:', error);
    } finally {
      // CRÍTICO: Limpieza garantizada del lado del cliente
      // Esto purga el token, el payload y redirige a /login (definido en authenticate-user)
      useAuthStore.getState().logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-red-500 hover:text-red-700 font-medium transition-colors bg-transparent border border-red-500 hover:bg-red-50 px-4 py-2 rounded disabled:opacity-50"
    >
      {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </button>
  );
};