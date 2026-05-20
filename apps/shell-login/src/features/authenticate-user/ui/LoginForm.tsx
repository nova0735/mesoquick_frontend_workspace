import React, { useState } from 'react';
import { useAuthStore } from '../../../entities/session/model/auth.store';
import { ROLE_TO_APP_URL } from '../../../shared/config/app-registry';

// ==========================================
// FEATURE: Authenticate User
// ==========================================
// 🧩 NOTA DE ARQUITECTURA (FSD):
// Este componente es una 'feature'. Contiene toda la lógica y UI para una
// funcionalidad específica: el formulario de inicio de sesión.
// Consume el 'model' (useAuthStore) para realizar la acción de login,
// pero no sabe nada sobre otras features.

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🧩 FSD: Obtenemos el estado y las acciones desde nuestro Model.
  // La Vista queda "tonta", solo delega y reacciona al estado global.
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // El store hace todo el trabajo sucio
      await login(email, password);

      // Despachamos al usuario a su app según su rol (mapa en app-registry.ts)
      const state = useAuthStore.getState();
      const token = state.token;
      const role = state.user?.role;

      if (!token || !role) {
        console.error('Login OK pero el store no tiene token/rol.');
        return;
      }

      const targetUrl = ROLE_TO_APP_URL[role];
      if (!targetUrl) {
        console.error(`Rol "${role}" sin URL registrada en ROLE_TO_APP_URL (app-registry.ts).`);
        return;
      }

      window.location.href = `${targetUrl}?token=${encodeURIComponent(token)}`;
    } catch (err) {
      console.error("Login fallido:", err);
      // El error visual ya se maneja mapeando la variable `error` del store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3c606b] focus:border-[#3c606b] sm:text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3c606b] focus:border-[#3c606b] sm:text-sm" />
      </div>
      <div>
        <button type="submit" disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3c606b] hover:bg-[#2a454d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3c606b] disabled:bg-gray-400">
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
};