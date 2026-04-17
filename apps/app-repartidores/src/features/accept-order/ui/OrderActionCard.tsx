import React from 'react';
import { useAcceptStore } from '../model/useAcceptStore';

export interface OrderActionCardProps {
  orderId: string;
  onSuccess?: () => void;
}

export const OrderActionCard: React.FC<OrderActionCardProps> = ({ orderId, onSuccess }) => {
  const { takeOrder, isAccepting, error } = useAcceptStore();

  const handleAccept = async () => {
    try {
      await takeOrder(orderId);
      onSuccess?.();
    } catch (err) {
      // Handled globally in the store
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {error && (
        <div className="p-2 text-sm font-medium text-center text-red-600 rounded bg-red-50">
          {error}
        </div>
      )}
      <button
        onClick={handleAccept}
        disabled={isAccepting}
        className={`w-full py-3 px-4 flex justify-center items-center font-bold rounded-lg text-white transition-colors ${
          isAccepting 
            ? 'bg-green-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isAccepting ? (
          'Accepting Order...'
        ) : (
          'Accept Order'
        )}
      </button>
    </div>
  );
};