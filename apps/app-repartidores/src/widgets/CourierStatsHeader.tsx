import React from 'react';
import { useWalletStore } from '../entities/wallet/model/useWalletStore';

export const CourierStatsHeader: React.FC = () => {
  const morosityState = useWalletStore((state) => state.morosityState);

  if (morosityState === 'NONE') return null;

  const isCritical = morosityState === 'BLOCKED_CRITICAL_DEBT';

  return (
    <div className={`w-full p-3 text-center text-sm font-bold shadow-sm ${isCritical ? 'bg-red-500 text-white' : 'bg-[#edca11] text-primary'}`}>
      {isCritical 
        ? "CRITICAL ALERT: Your account is blocked due to unpaid cash debts exceeding 30 days. Please settle your debt immediately." 
        : "WARNING: You are in the grace period for unpaid cash debts. Please settle your balance in the Wallet to avoid suspension."}
    </div>
  );
};
