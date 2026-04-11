import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#f7f7f7]">
      <aside className="w-64 bg-[#3c606b] text-white flex flex-col shadow-xl">
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-[#2a454d]">
          <h2 className="text-2xl font-black tracking-tighter">MESOQUICK</h2>
        </div>
        
        {/* Navegación con nombres según el plan original */}
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="block p-3 rounded-lg hover:bg-[#2a454d] text-sm font-bold uppercase">
            Pedidos
          </Link>
          <Link to="/wallet" className="block p-3 rounded-lg hover:bg-[#2a454d] text-sm font-bold uppercase">
            Billetera Virtual
          </Link>
          <Link to="/support" className="block p-3 rounded-lg hover:bg-[#2a454d] text-sm font-bold uppercase">
            Soporte Técnico
          </Link>
          <Link to="/profile" className="block p-3 rounded-lg hover:bg-[#2a454d] text-sm font-bold uppercase">
            Perfil
          </Link>
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-[#2a454d]">
          <button className="text-xs font-bold uppercase opacity-60 hover:opacity-100 transition-opacity">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};