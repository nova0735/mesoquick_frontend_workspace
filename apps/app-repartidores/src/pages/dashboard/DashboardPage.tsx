import React from 'react';

// Importamos la feature de cambio de estado (Toggle) siguiendo la arquitectura FSD
import { StatusToggle } from '../../features/toggle-courier-status';

// ==========================================
// SHELL: DashboardPage (Página Principal)
// ==========================================
// Propósito: Servir como contenedor base (Layout Provider) para el Dashboard.
// 
// INSTRUCCIONES PARA DEV 2:
// Aquí es donde debes inyectar los widgets correspondientes a la visualización 
// del mapa de entregas y el feed de pedidos activos. Reemplaza el div con borde 
// punteado por tus componentes ubicados en la carpeta "features" o "widgets".

export const DashboardPage: React.FC = () => {
  return (
    <div className="w-full min-h-full">
      {/* Área del Encabezado (Header) */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#3c606b] tracking-tight">Dashboard Principal</h1>
        {/* Inyección de la Feature 1: Toggle de Estado */}
        <StatusToggle />
      </div>

      {/* ÁREA DE INYECCIÓN PARA WIDGETS (DEV 2) */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 bg-gray-50/50 min-h-[400px] flex items-center justify-center"> 
        [ÁREA DE INYECCIÓN - DEV 2: Colocar aquí el mapa y feed de pedidos] 
      </div>
    </div>
  );
};