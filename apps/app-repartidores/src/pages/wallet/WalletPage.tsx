import React, { useEffect, useState } from 'react';
import { DateRangePicker, Button } from '@mesoquick/ui-kit';
import { useWalletStore } from '../../entities/wallet/model/useWalletStore';
import { formatQuetzales } from '../../shared/utils/currency';
import { WithdrawForm } from '../../features/withdraw-funds';
import { PayDebtModal } from '../../features/pay-app-debt';

export const WalletPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  
  const [startDate, setStartDate] = useState<string>(lastMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today);
  const [selectedDebtTx, setSelectedDebtTx] = useState<{ id: string, amount: number } | null>(null);

  const balances = useWalletStore((state) => state.balances);
  const transactions = useWalletStore((state) => state.transactions);
  const isLoading = useWalletStore((state) => state.isLoading);
  const fetchWalletSummary = useWalletStore((state) => state.fetchWalletSummary);

  useEffect(() => {
    fetchWalletSummary(startDate, endDate);
  }, [startDate, endDate, fetchWalletSummary]);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Virtual Wallet</h1>
        <p className="text-primary/70 mt-2">Track your earnings, manage cash debt, and withdraw funds.</p>
      </header>

      {/* Date Filter & Balances Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-3 bg-white shadow-md rounded-lg p-6">
          <DateRangePicker 
            startDate={startDate} 
            endDate={endDate} 
            onChangeStartDate={setStartDate} 
            onChangeEndDate={setEndDate}
          />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center border-t-4 border-green-500">
          <h2 className="text-sm font-semibold text-primary/70 uppercase">Positive Balance</h2>
          <span className="text-3xl font-bold text-green-600 my-2">{formatQuetzales(balances.positiveBalance)}</span>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center border-t-4 border-red-500">
          <h2 className="text-sm font-semibold text-primary/70 uppercase">App Debt (Cash)</h2>
          <span className="text-3xl font-bold text-red-500 my-2">{formatQuetzales(balances.appDebt)}</span>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center border-t-4 border-primary">
          <h2 className="text-sm font-semibold text-primary/70 uppercase">Total Earned</h2>
          <span className="text-3xl font-bold text-primary my-2">{formatQuetzales(balances.totalEarned)}</span>
        </div>
      </section>

      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1">
          <WithdrawForm/>
        </div>

        <div className="col-span-1 lg:col-span-3 bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <h3 className="text-lg font-bold text-primary mb-4">Transaction History</h3>
          {isLoading ? (
             <p className="text-primary/70">Loading transactions...</p>
          ) : (
            <table className="w-full text-left text-sm text-primary">
              <thead className="bg-base border-b border-gray-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Method</th>
                  <th className="p-3 text-right">Earned Fee</th>
                  <th className="p-3 text-right">Resulting Balance</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center">No transactions found for this period.</td></tr>
                ) : transactions.map((tx) => (
                  <tr key={tx.transactionId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="p-3 font-mono text-xs">{tx.orderId}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.paymentMethod === 'CASH' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-right text-green-600 font-semibold">+{formatQuetzales(tx.earnedFee)}</td>
                    <td className="p-3 text-right font-semibold">{formatQuetzales(tx.resultingBalance)}</td>
                    <td className="p-3 text-center">
                      {tx.paymentMethod === 'CASH' && !tx.isDebtSettled && (
                        <Button 
                          variant="danger" 
                          className="text-xs py-1 px-2" 
                          onClick={() => setSelectedDebtTx({ id: tx.transactionId, amount: Math.abs(tx.resultingBalance) })}
                        >
                          Settle Debt
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <PayDebtModal 
        isOpen={selectedDebtTx !== null} 
        transactionId={selectedDebtTx?.id || ''} 
        amount={selectedDebtTx?.amount || 0} 
        onClose={() => setSelectedDebtTx(null)} 
      />
    </div>
  );
};
