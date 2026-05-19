import React, { type ReactNode } from 'react';

interface AccountGuardProps {
  children: ReactNode;
}

type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export const AccountGuard: React.FC<AccountGuardProps> = ({ children }) => {
  // MOCK: Simulación de lectura de estado
  // Cambia este valor a 'SUSPENDED' o 'PENDING' para probar el bloqueo.
const accountStatus = ('ACTIVE' as any) as AccountStatus;

  if (accountStatus === 'SUSPENDED' || accountStatus === 'PENDING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center border-t-4 border-[#3c606b]">
          <h1 className="text-2xl font-bold text-[#3c606b] mb-4">
            Cuenta {accountStatus === 'SUSPENDED' ? 'Suspendida' : 'en Revisión'}
          </h1>
          <p className="text-gray-600 mb-6">
            Tu perfil no está activo en este momento. Por favor, contacta a soporte o espera a que un administrador valide tus datos para poder operar.
          </p>
        </div>
      </div>
    );
  }

  // Si está activa, renderizamos la vista o el contenido interno sin alteraciones
  return <>{children}</>;
};