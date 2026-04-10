import React from 'react';
import { Link } from 'react-router-dom';

export const BaseSidebar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 min-h-screen bg-primary text-base flex flex-col p-6">
      <div className="mb-10 text-2xl font-bold tracking-wider text-center border-b border-white/20 pb-4">
        MESOQUICK
      </div>
      <nav className="flex flex-col gap-4 flex-1">
        <Link to="/dashboard" className="hover:text-white/70 transition-colors">
          PEDIDOS
        </Link>
        <Link to="/wallet" className="hover:text-white/70 transition-colors">
          BILLETERA VIRTUAL
        </Link>
        <Link to="/support" className="hover:text-white/70 transition-colors">
          SOPORTE TÉCNICO
        </Link>
        <Link to="/profile" className="hover:text-white/70 transition-colors">
          PERFIL
        </Link>
      </nav>
      <div className="mt-auto">
        <button onClick={handleLogout} className="text-red-300 hover:text-red-400 font-bold transition-colors">
          CERRAR SESIÓN
        </button>
      </div>
    </aside>
  );
};