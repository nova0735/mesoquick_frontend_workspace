import React from 'react';
import { useStatusUpdateStore } from '../model/useStatusUpdateStore';

export interface StatusStepButtonProps {
  orderId: string;
  currentStatus: string;
  onDelivered?: () => void;
}

export const StatusStepButton: React.FC<StatusStepButtonProps> = ({ orderId, currentStatus, onDelivered }) => {
  const { changeStatus, isUpdating } = useStatusUpdateStore();

  let nextStatus = '';
  let buttonLabel = '';

  switch (currentStatus) {
    case 'ACCEPTED':
      nextStatus = 'PICKING_UP';
      buttonLabel = "Estoy en el comercio";
      break;
    case 'PICKING_UP':
      nextStatus = 'ARRIVED_AT_BUSINESS';
      buttonLabel = "Pedido Recolectado";
      break;
    case 'ARRIVED_AT_BUSINESS':
      nextStatus = 'DELIVERED';
      buttonLabel = "Marcar como Entregado";
      break;
    default:
      return null;
  }

  const handleClick = async () => {
    if (!nextStatus) return;
    
    await changeStatus(orderId, nextStatus);
    
    if (nextStatus === 'DELIVERED') {
      onDelivered?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUpdating}
      className={`w-full py-4 px-4 font-bold rounded-xl text-white transition-colors ${
        isUpdating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {isUpdating ? 'Actualizando...' : buttonLabel}
    </button>
  );
};