import React from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// PAGE: NotFoundPage (Error 404)
// ==========================================
// 🧩 NOTA DE ARQUITECTURA:
// Página mostrada cuando el usuario navega a una ruta que no existe en el Router.

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#3c606b] tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Página no encontrada</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Lo sentimos, la ruta a la que intentas acceder no existe o fue movida a otra ubicación.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-[#56bd64] text-white hover:bg-[#459c51] font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-sm"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};