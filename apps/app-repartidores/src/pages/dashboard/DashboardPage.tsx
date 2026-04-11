import React from 'react';
import { AccountGuard } from '../../features/check-account-status';
import { StatusToggle } from '../../features/toggle-courier-status';

/**
 * PÁGINA: Dashboard del Repartidor
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Capa de Composición (`pages`). Aquí es donde las Features interactúan visualmente.
 * Las features no se conocen entre ellas, la página es la encargada de ensamblarlas.
 */
export const DashboardPage: React.FC = () => {
  return (
    <AccountGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Layout Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#3c606b]">MesoQuick Repartidor</h1>
          {/* Inyectamos el interruptor de estado aislado */}
          <StatusToggle />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="text-gray-400 text-lg">
            Área de mapa y pedidos entrantes...
          </p>
        </main>
      </div>
    </AccountGuard>
  );
};