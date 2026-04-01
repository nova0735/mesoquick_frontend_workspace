import React from 'react';

// Este componente es "tonto". No sabe de rutas ni de lógica. 
// Solo dibuja el fondo y espera que le inyecten los links (children).
export const BaseSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <aside className="w-64 min-h-screen bg-primary text-white flex flex-col shadow-lg">
      <div className="p-6 font-bold text-2xl border-b border-white/20">
        MesoQuick
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {children}
      </nav>
    </aside>
  );
};
