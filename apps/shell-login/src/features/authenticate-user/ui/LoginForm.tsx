import React, { useState } from 'react';
import { loginUser } from '../api/auth.api';
import { useAuthStore } from '../model/useAuthStore';
import { jwtDecode } from 'jwt-decode';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, password });
      // Fallback depending on your backend response format
      const token = data?.token || data?.access_token || data;
      if (typeof token === 'string') {
        login(token);

        // Decodificamos localmente para tomar la decisión de ruteo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken = jwtDecode<any>(token);

        /**
         * ==========================================
         * 🔀 ORQUESTADOR CENTRAL (Orchestration Switch)
         * ==========================================
         * Equipo: Agreguen aquí los "case" para las demás aplicaciones.
         * El rol devuelto en el JWT dictamina a qué Micro-Frontend navegamos.
         */
        switch (decodedToken.role) {
          case 'COURIER':
            // Redirige a la app de Repartidores
            window.location.href = 'http://localhost:5173';
            break;
          default:
            alert(`Rol no reconocido (${decodedToken.role}) o aplicación no configurada.`);
            break;
        }
      } else {
        throw new Error('Formato de token inválido en la respuesta.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
      
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56bd64]"
          required
        />
      </div>
      
      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#56bd64]"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="bg-[#56bd64] hover:bg-[#37e64f] text-white font-semibold w-full py-2 rounded transition-colors"
      >
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};