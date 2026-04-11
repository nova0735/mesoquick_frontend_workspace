import React from 'react';
import { MapViewer } from '@mesoquick/ui-kit';

export const DashboardPage: React.FC = () => {
  return (
    <div className="p-8 flex flex-col gap-6 animate-fadeIn">
      {/* Header según el diseño original */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-[#3c606b]">Dashboard Principal</h1>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
           Desconectado <div className="w-10 h-5 bg-gray-200 rounded-full relative">
             <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
           </div>
        </div>
      </div>

      {/* Área de Inyección para el Dev 2 */}
      <div className="border-2 border-dashed border-gray-100 rounded-2xl min-h-[500px] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <p className="text-gray-300 font-bold uppercase tracking-widest text-sm bg-white/80 px-4 py-2 rounded-full">
            [ÁREA DE INYECCIÓN - DEV 2: Colocar aquí el mapa y feed de pedidos]
          </p>
        </div>
        
        {/* El MapViewer se queda de fondo como base */}
        <MapViewer />
      </div>
    </div>
  );
};