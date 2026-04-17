import React from 'react';

export interface ActionDropdownMenuProps {
  options?: any[];
}

export const ActionDropdownMenu: React.FC<ActionDropdownMenuProps> = ({ options }) => {
  return (
    <button 
      className="px-3 py-1 bg-gray-200 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-300"
      // Usamos la variable para silenciar el error estricto de TypeScript
      onClick={() => console.log('Opciones recibidas en el Mock:', options)}
    >
      Acciones Soporte
    </button>
  );
};