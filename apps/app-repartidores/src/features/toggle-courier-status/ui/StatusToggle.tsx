import React from 'react';
import { useStatusStore } from '../model/status.store';

/**
 * COMPONENTE DE UI: Interruptor de Disponibilidad (Toggle)
 * 
 * 🧩 NOTA DE ARQUITECTURA FSD:
 * Lee directamente de su modelo hermano (`status.store.ts`) evitando acoplarse 
 * a otras entidades globales. Solo le importa conectar o desconectar al usuario.
 */
export const StatusToggle: React.FC = () => {
  const { isOnline, isLoading, toggleStatus } = useStatusStore();

  return (
    <button
      onClick={toggleStatus}
      disabled={isLoading}
      className={`
        relative inline-flex h-10 w-40 items-center justify-center rounded-full
        font-semibold text-white transition-colors duration-300 shadow-sm
        disabled:opacity-60 disabled:cursor-wait
        ${isOnline ? 'bg-[#56bd64] hover:bg-[#37e64f]' : 'bg-gray-400 hover:bg-gray-500'}
      `}
    >
      {isLoading && <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full" />}
      <span>{isOnline ? '🟢 Conectado' : '⚪ Desconectado'}</span>
    </button>
  );
};