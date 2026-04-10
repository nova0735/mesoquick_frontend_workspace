import React from 'react';
import { useAvailabilityStore } from '../model/useAvailabilityStore';

/**
 * COMPONENTE DE UI: Interruptor de Conexión (Toggle)
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Este componente lee la disponibilidad del repartidor y provee un switch visual
 * estilizado con los colores del Brandbook para cambiar dicho estado.
 * Bloquea la interacción durante las peticiones (isLoading).
 */
export const StatusToggle: React.FC = () => {
  const { isAvailable, isLoading, toggleStatus } = useAvailabilityStore();

  return (
    <div className="flex items-center space-x-3">
      {/* Etiqueta Visual de Estado */}
      <span
        className={`text-sm transition-all duration-300 ${
          isAvailable ? 'text-[#3c606b] font-bold' : 'text-gray-600'
        }`}
      >
        {isAvailable ? 'Conectado' : 'Desconectado'}
      </span>

      {/* Botón Interruptor tipo Píldora */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => toggleStatus(isAvailable)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
          isAvailable ? 'bg-[#56bd64]' : 'bg-gray-300'
        }`}
        aria-pressed={isAvailable}
        aria-label="Alternar estado de conexión"
      >
        <span className="sr-only">Conectarse o desconectarse</span>
        
        {/* Círculo interno deslizante */}
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-all duration-300 ${
            isAvailable ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>

      {/* Feedback opcional de red */}
      {isLoading && <span className="text-xs text-gray-400 animate-pulse">...</span>}
    </div>
  );
};