import React, { useState } from 'react';
// Importamos las features correspondientes siguiendo FSD
import { LoginForm } from '../../features/authenticate-user';
import { ResetPasswordForm } from '../../features/reset-password';

export const LoginPage: React.FC = () => {
  // Estado local para alternar entre la vista de inicio de sesión y recuperación de contraseña
  const [isResetMode, setIsResetMode] = useState(false);

  return (
    // Contenedor principal: pantalla completa, centrado y con el fondo de la marca
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
      
      {/* Contenedor de la tarjeta */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md relative">
        
        {/* Área del Logo / Título */}
        <h1 className="text-center text-3xl font-bold text-[#3c606b] mb-2">
          MesoQuick
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isResetMode ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
        </p>

        {/* Renderizado Condicional de Formularios */}
        {!isResetMode ? (
          <>
            <LoginForm />
            <button
              onClick={() => setIsResetMode(true)}
              className="text-sm text-[#3c606b] hover:underline mt-4 block text-center w-full"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        ) : (
          <>
            <ResetPasswordForm />
            <button
              onClick={() => setIsResetMode(false)}
              className="text-sm text-[#3c606b] hover:underline mt-4 block text-center w-full"
            >
              Volver al inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
};