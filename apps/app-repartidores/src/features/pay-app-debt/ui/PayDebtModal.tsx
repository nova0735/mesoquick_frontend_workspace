import React from 'react';
import { Button } from '@mesoquick/ui-kit';
import { useDebtStore } from '../model/useDebtStore';
import { useWalletStore } from '../../../entities/wallet/model/useWalletStore';

export interface PayDebtModalProps {
  transactionId: string;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PayDebtModal: React.FC<PayDebtModalProps> = ({ transactionId, amount, isOpen, onClose }) => {
  const isPaying = useDebtStore((state) => state.isPaying);
  const payDebt = useDebtStore((state) => state.payDebt);
  const fetchWalletSummary = useWalletStore((state) => state.fetchWalletSummary);

  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      await payDebt({ transactionId });
      
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setDate(lastMonth.getDate() - 30);
      
      await fetchWalletSummary(lastMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]);
      onClose();
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-red-500">Settle Cash Debt</h2>
        <p className="text-primary text-sm">
          You are about to settle the debt for transaction <span className="font-semibold">{transactionId}</span>.
        </p>
        <p className="text-primary font-bold text-lg text-center bg-gray-100 py-2 rounded-md">
          Amount to Pay: GTQ {amount.toFixed(2)}
        </p>
        
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={isPaying} className="w-full">
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePayment} isLoading={isPaying} className="w-full">
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
};
