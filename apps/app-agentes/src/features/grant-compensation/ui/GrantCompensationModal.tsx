import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import type { SupportUser } from '../../../entities/support-user';
import {
  COMPENSATION_KIND_LABEL,
  COUPON_DISCOUNT_TYPE_LABEL,
  useAdminStore,
  type CompensationKind,
  type CompensationRecord,
  type CouponDiscountType,
} from '../../../entities/admin-action';
import { useSessionStore } from '../../../entities/session';

interface GrantCompensationModalProps {
  isOpen: boolean;
  user: SupportUser;
  onClose: () => void;
}

/**
 * Modal para otorgar compensación a un usuario.
 *
 * Dos modalidades:
 * - CREDIT: crédito directo al wallet del usuario (monto en HNL).
 * - COUPON: genera un cupón con código + tipo de descuento (% o fijo) +
 *   vencimiento. El código se previsualiza acá pero en producción lo emite
 *   el servicio backend de cupones.
 *
 * Tras confirmar, si fue cupón, se muestra el código generado para que el
 * agente pueda comunicárselo al cliente durante el chat.
 *
 * TODO(backend): POST /api/support/compensations (crédito) y
 * POST /api/coupons (cupón) — separar llamadas o tener un endpoint unificado
 * según lo que exponga el backend de cupones.
 */
export function GrantCompensationModal({
  isOpen,
  user,
  onClose,
}: GrantCompensationModalProps) {
  const [kind, setKind] = useState<CompensationKind>('CREDIT');
  const [amountStr, setAmountStr] = useState('');
  const [couponDiscountType, setCouponDiscountType] =
    useState<CouponDiscountType>('PERCENT');
  const [expiresAt, setExpiresAt] = useState(getDefaultExpiration());
  const [reason, setReason] = useState('');
  const [justIssued, setJustIssued] = useState<CompensationRecord | null>(null);

  const grantedBy = useSessionStore((s) => s.user?.name ?? 'Agente');
  const grantCompensation = useAdminStore((s) => s.grantCompensation);

  const parsedAmount = parseFloat(amountStr);
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const canSubmit = isAmountValid && reason.trim().length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const record = grantCompensation({
      userId: user.id,
      userType: user.type,
      kind,
      amount: parsedAmount,
      couponDiscountType: kind === 'COUPON' ? couponDiscountType : undefined,
      couponExpiresAt:
        kind === 'COUPON' ? new Date(expiresAt).toISOString() : undefined,
      reason: reason.trim(),
      grantedBy,
    });

    if (kind === 'COUPON') {
      setJustIssued(record);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setKind('CREDIT');
    setAmountStr('');
    setReason('');
    setCouponDiscountType('PERCENT');
    setExpiresAt(getDefaultExpiration());
    setJustIssued(null);
    onClose();
  };

  if (justIssued && justIssued.couponCode) {
    return (
      <Modal
        isOpen={isOpen}
        title="Cupón generado"
        description={`El cupón fue emitido para ${user.name}.`}
        onClose={resetAndClose}
      >
        <div className="space-y-4">
          <div className="bg-accent/10 border-2 border-dashed border-accent rounded-lg p-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
              Código del cupón
            </p>
            <p className="text-2xl font-mono font-bold text-primary mt-1 select-all">
              {justIssued.couponCode}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Descuento:{' '}
              {justIssued.couponDiscountType === 'PERCENT'
                ? `${justIssued.amount}%`
                : `HNL ${justIssued.amount.toFixed(2)}`}
            </p>
            {justIssued.couponExpiresAt && (
              <p className="text-xs text-gray-500">
                Vence:{' '}
                {new Date(justIssued.couponExpiresAt).toLocaleDateString(
                  'es-HN',
                )}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-600 text-center">
            Puedes compartir este código con el usuario desde el chat.
          </p>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition"
            >
              Listo
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Otorgar compensación"
      description={`Compensar a ${user.name} con crédito directo o un cupón.`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            Modalidad
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(['CREDIT', 'COUPON'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setKind(option)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition ${
                  kind === option
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                }`}
              >
                {COMPENSATION_KIND_LABEL[option]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            {kind === 'CREDIT'
              ? 'Monto de crédito (HNL)'
              : couponDiscountType === 'PERCENT'
                ? 'Porcentaje de descuento (%)'
                : 'Monto del descuento (HNL)'}
          </span>
          <input
            type="number"
            min="0"
            step={couponDiscountType === 'PERCENT' && kind === 'COUPON' ? '1' : '0.01'}
            value={amountStr}
            onChange={(event) => setAmountStr(event.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </label>

        {kind === 'COUPON' && (
          <>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Tipo de descuento
              </span>
              <select
                value={couponDiscountType}
                onChange={(event) =>
                  setCouponDiscountType(event.target.value as CouponDiscountType)
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="PERCENT">
                  {COUPON_DISCOUNT_TYPE_LABEL.PERCENT}
                </option>
                <option value="FIXED">
                  {COUPON_DISCOUNT_TYPE_LABEL.FIXED}
                </option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Fecha de vencimiento
              </span>
              <input
                type="date"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </label>
          </>
        )}

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Motivo
          </span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            required
            placeholder="¿Por qué se otorga esta compensación?"
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
            {kind === 'CREDIT' ? 'Acreditar' : 'Generar cupón'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function getDefaultExpiration(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}
