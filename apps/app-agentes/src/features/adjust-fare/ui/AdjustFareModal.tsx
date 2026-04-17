import { useMemo, useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import type { OrderHistoryItem } from '../../../entities/order-history';
import type { SupportUserType } from '../../../entities/support-user';
import {
  FARE_ADJUSTMENT_TYPE_LABEL,
  useAdminStore,
  type FareAdjustmentType,
} from '../../../entities/admin-action';
import { useSessionStore } from '../../../entities/session';

interface AdjustFareModalProps {
  isOpen: boolean;
  order: OrderHistoryItem;
  userType: SupportUserType;
  userId: string;
  onClose: () => void;
}

const ADJUSTMENT_ORDER: readonly FareAdjustmentType[] = [
  'DISCOUNT',
  'REFUND',
  'OVERRIDE',
];

/**
 * Modal para ajustar el total de una orden desde el historial.
 *
 * Tres modos:
 * - DISCOUNT: agente escribe un monto de descuento, newTotal = original - monto.
 * - REFUND: newTotal = 0 (reembolso total).
 * - OVERRIDE: agente escribe directamente el nuevo total.
 *
 * TODO(backend): POST /api/support/orders/{orderId}/fare-adjustment.
 */
export function AdjustFareModal({
  isOpen,
  order,
  userType,
  userId,
  onClose,
}: AdjustFareModalProps) {
  const [adjustmentType, setAdjustmentType] =
    useState<FareAdjustmentType>('DISCOUNT');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');

  const adjustedBy = useSessionStore((s) => s.user?.name ?? 'Agente');
  const adjustFare = useAdminStore((s) => s.adjustFare);

  const parsedAmount = parseFloat(amount);
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount >= 0;

  const newTotal = useMemo(() => {
    if (adjustmentType === 'REFUND') return 0;
    if (!isAmountValid) return order.total;
    if (adjustmentType === 'DISCOUNT') {
      return Math.max(0, order.total - parsedAmount);
    }
    return parsedAmount;
  }, [adjustmentType, parsedAmount, isAmountValid, order.total]);

  const canSubmit =
    reason.trim().length > 0 &&
    (adjustmentType === 'REFUND' || isAmountValid) &&
    newTotal !== order.total;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    adjustFare({
      orderId: order.id,
      userId,
      userType,
      originalTotal: order.total,
      adjustmentType,
      newTotal,
      reason: reason.trim(),
      adjustedBy,
    });
    setAmount('');
    setReason('');
    setAdjustmentType('DISCOUNT');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Ajustar tarifa"
      description={`Orden ${order.id} · Total actual: HNL ${order.total.toFixed(2)}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Tipo de ajuste
          </span>
          <select
            value={adjustmentType}
            onChange={(event) =>
              setAdjustmentType(event.target.value as FareAdjustmentType)
            }
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {ADJUSTMENT_ORDER.map((type) => (
              <option key={type} value={type}>
                {FARE_ADJUSTMENT_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </label>

        {adjustmentType !== 'REFUND' && (
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
              {adjustmentType === 'DISCOUNT'
                ? 'Monto de descuento (HNL)'
                : 'Nuevo total (HNL)'}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </label>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Nuevo total
          </span>
          <span className="text-lg font-bold text-primary">
            HNL {newTotal.toFixed(2)}
          </span>
        </div>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Motivo
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            required
            placeholder="¿Por qué se ajusta esta tarifa?"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aplicar ajuste
          </button>
        </div>
      </form>
    </Modal>
  );
}
