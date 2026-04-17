import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { CourierBalance } from '../../../entities/support-user';

interface CourierBalanceCardProps {
  balance: CourierBalance | null;
}

/**
 * Tarjeta de saldo del repartidor. Se renderiza como una SECCIÓN dentro del
 * UserDetailPage cuando el usuario consultado es de tipo COURIER
 * (no es un tab aparte).
 *
 * Si no hay saldo registrado para el courier, muestra un placeholder.
 */
export function CourierBalanceCard({ balance }: CourierBalanceCardProps) {
  if (!balance) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Saldo del repartidor
        </h2>
        <p className="text-sm text-gray-500">
          Sin información de saldo para este repartidor.
        </p>
      </div>
    );
  }

  const total = balance.available + balance.inTransit;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
          Saldo del repartidor
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <BalanceTile
          label="Disponible"
          amount={balance.available}
          currency={balance.currency}
          highlight
        />
        <BalanceTile
          label="En tránsito"
          amount={balance.inTransit}
          currency={balance.currency}
        />
        <BalanceTile
          label="Total"
          amount={total}
          currency={balance.currency}
        />
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Movimientos recientes
        </h3>
        {balance.recentMovements.length === 0 ? (
          <p className="text-sm text-gray-500">Sin movimientos recientes.</p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {balance.recentMovements.map((movement) => {
              const isDebit = movement.amount < 0;
              return (
                <li
                  key={movement.id}
                  className="flex items-center gap-3 px-3 py-2 text-sm"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDebit
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-base/15 text-green-base'
                    }`}
                  >
                    {isDebit ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 truncate">
                      {movement.concept}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(movement.date)}
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      isDebit ? 'text-red-600' : 'text-green-base'
                    }`}
                  >
                    {isDebit ? '-' : '+'}
                    {balance.currency} {Math.abs(movement.amount).toFixed(2)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

interface BalanceTileProps {
  label: string;
  amount: number;
  currency: 'HNL';
  highlight?: boolean;
}

function BalanceTile({ label, amount, currency, highlight }: BalanceTileProps) {
  return (
    <div
      className={`rounded-lg p-3 border ${
        highlight
          ? 'bg-primary text-white border-primary'
          : 'bg-gray-50 text-gray-900 border-gray-200'
      }`}
    >
      <div
        className={`text-[10px] font-bold uppercase tracking-wider ${
          highlight ? 'text-white/80' : 'text-gray-500'
        }`}
      >
        {label}
      </div>
      <div className="text-lg font-bold mt-1">
        {currency} {amount.toFixed(2)}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-HN', {
    month: 'short',
    day: '2-digit',
  });
}
