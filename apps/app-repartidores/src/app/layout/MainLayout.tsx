import React from 'react';
// En un futuro importaremos { BaseSidebar } de '@mesoquick/ui-kit'
// y { Outlet, Link } de 'react-router-dom'

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-base">
      {/* Aquí tu compañero implementará el <BaseSidebar> e inyectará los Links:
        - PEDIDOS
        - BILLETERA VIRTUAL
        - SOPORTE TÉCNICO
        - PERFIL
      */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children} {/* Aquí se renderizará el Dashboard, Billetera, etc. */}
      </main>
    </div>
  );
};
