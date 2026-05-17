import { useState } from 'react';
import { Banknote, CreditCard } from 'lucide-react';
import { Button, Badge } from '@shared/ui';
import { cn } from '@shared/lib/cn';
import type { PaymentMethod } from '@shared/types';
import type { PaymentFormData } from '@features/checkout/model/checkout.types';
import CouponInput from './CouponInput';

interface PaymentOption {
  value: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: 'cash',
    label: 'Efectivo',
    icon: <Banknote className="w-5 h-5" />,
    description: 'Paga al repartidor',
  },
  {
    value: 'credit_card',
    label: 'Tarjeta de crédito',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Visa, Mastercard, etc.',
  },
  {
    value: 'debit_card',
    label: 'Tarjeta de débito',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Débito bancario',
  },
];

interface PaymentStepProps {
  initialData: PaymentFormData | null;
  appliedCoupon: string | null;
  onApplyCoupon: (coupon: string, discount: number) => void;
  onRemoveCoupon: () => void;
  onNext: (data: PaymentFormData) => void;
  onBack: () => void;
}

export default function PaymentStep({
  initialData,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onNext,
  onBack,
}: PaymentStepProps) {
  const [selected, setSelected] = useState<PaymentMethod>(
    initialData?.method ?? 'cash'
  );

  const handleNext = () => {
    onNext({ method: selected, couponCode: appliedCoupon ?? undefined });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-text-heading">Método de pago</h2>
        <p className="text-sm text-text mt-0.5">Elige cómo quieres pagar tu pedido.</p>
      </div>

      {/* Opciones de pago */}
      <div className="space-y-2">
        {PAYMENT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
              selected === option.value
                ? 'border-accent bg-accent-bg'
                : 'border-border hover:border-accent-border hover:bg-accent-bg/40'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                selected === option.value
                  ? 'bg-accent text-white'
                  : 'bg-border/40 text-text'
              )}
            >
              {option.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-heading">{option.label}</p>
              <p className="text-xs text-text">{option.description}</p>
            </div>
            {selected === option.value && (
              <Badge variant="accent">Seleccionado</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Cupón */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-heading">¿Tienes un cupón?</p>
        <CouponInput
          appliedCoupon={appliedCoupon}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Atrás
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Ver resumen
        </Button>
      </div>
    </div>
  );
}
