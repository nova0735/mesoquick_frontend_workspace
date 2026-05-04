import React from 'react';
import { Button } from '@mesoquick/ui-kit';
import { useWithdrawStore } from '../model/useWithdrawStore';
import { useWalletStore } from '../../../entities/wallet/model/useWalletStore';

export const WithdrawForm: React.FC = () => {
  const isWithdrawing = useWithdrawStore((state) => state.isWithdrawing);
  const processWithdrawal = useWithdrawStore((state) => state.processWithdrawal);
  const fetchWalletSummary = useWalletStore((state) => state.fetchWalletSummary);

  const handleWithdraw = async () => {
    try {
      await processWithdrawal();
      
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setDate(lastMonth.getDate() - 30);
      
      await fetchWalletSummary(lastMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    } catch (err) {
      // Error is handled via store
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-md items-center text-center">
      <h3 className="text-lg font-bold text-primary mb-2">Available Earnings</h3>
      <p className="text-sm text-primary/70 mb-4">
        Transfer your positive balance to your linked bank account. Processing is immediate.
      </p>
      <Button variant="primary" onClick={handleWithdraw} isLoading={isWithdrawing} className="w-full">
        Transfer Funds to Bank Account
      </Button>
    </div>
  );
};
