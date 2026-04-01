import React from 'react';
// Aquí el desarrollador importará y renderizará el <LoginForm /> desde el feature

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center font-sans">
      {/* Contenedor principal donde irá el formulario */}
      <div className="p-8 bg-white shadow-md rounded-lg border-t-4 border-primary w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">MesoQuick</h1>
        <p className="text-center text-gray-500 mb-4">Inicia sesión en tu cuenta</p>
        
        {/* Aquí debe ir el componente del feature: <LoginForm /> */}
      </div>
    </div>
  );
};
