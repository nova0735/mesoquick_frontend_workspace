import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base text-primary">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Ruta no encontrada</p>
      <Link to="/dashboard" className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">
        Volver al Inicio
      </Link>
    </div>
  );
};