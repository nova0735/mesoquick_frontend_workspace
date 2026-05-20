import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../features/authenticate-user';
import { ResetPasswordForm } from '../../features/reset-password';

export const LoginPage: React.FC = () => {
  // ✅ REGLA DE ORO: Todos los hooks (useNavigate, useState) viven ADENTRO del componente
  const navigate = useNavigate();
  const [isResetMode, setIsResetMode] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        
        {/* Encabezado dinámico */}
        <h2 className="text-3xl font-bold text-[#3c606b] mb-2 text-center">
          {isResetMode ? 'Recuperar Acceso' : 'Bienvenido a MesoQuick'}
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          {isResetMode 
            ? 'Ingresa tu correo para restablecer tu contraseña' 
            : 'Ingresa tus credenciales para continuar'}
        </p>

        {/* Lógica condicional: Login vs Recuperar Contraseña */}
        {!isResetMode ? (
          <>
            <LoginForm />
            <button
              onClick={() => setIsResetMode(true)}
              className="w-full text-sm text-[#3c606b] hover:underline mt-4 text-center"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        ) : (
          <>
            <ResetPasswordForm />
            <button
              onClick={() => setIsResetMode(false)}
              className="w-full text-sm text-[#3c606b] hover:underline mt-4 text-center"
            >
              Volver al inicio de sesión
            </button>
          </>
        )}

        {/* 👇 EL PUENTE HACIA EL REGISTRO 👇 */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta en MesoQuick?
          </p>
          <button
            onClick={() => navigate('/register')}
            className="w-full mt-3 border-2 border-[#3c606b] text-[#3c606b] font-semibold py-2 rounded-lg hover:bg-[#3c606b] hover:text-white transition-colors duration-300"
          >
            Crear cuenta nueva
          </button>
        </div>

      </div>
    </div>
  );
};