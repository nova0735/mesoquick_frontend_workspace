import { useEffect, useState } from 'react';
import { Banknote, CreditCard, Plus, Lock } from 'lucide-react';
import { Button } from '@shared/ui';
import { cn } from '@shared/lib/cn';
import type { PaymentMethod } from '@shared/types';
import type { PaymentFormData } from '@features/checkout/model/checkout.types';
import {
  usePaymentMethods,
  CardForm,
  CardItem,
  getShortMask,
} from '@features/payments';
import CouponInput from './CouponInput';

interface PaymentStepProps {
  initialData: PaymentFormData | null;
  appliedCoupon: string | null;
  onApplyCoupon: (coupon: string, discount: number) => void;
  onRemoveCoupon: () => void;
  onNext: (data: PaymentFormData) => void;
  onBack: () => void;
}

type PaymentChoice = 'cash' | 'card';

export default function PaymentStep({
  initialData,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onNext,
  onBack,
}: PaymentStepProps) {
  const { cards, defaultCard, hasCards } = usePaymentMethods();

  const initialChoice: PaymentChoice =
    initialData?.method === 'cash' ? 'cash' : 'card';
  const [choice, setChoice] = useState<PaymentChoice>(initialChoice);

  // Tarjeta seleccionada (cuando choice === 'card')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    defaultCard?.id ?? null
  );

  // Mostrar formulario de nueva tarjeta
  const [showCardForm, setShowCardForm] = useState(false);

  // Si hay tarjetas y no hay una seleccionada todavía, seleccionar la predeterminada
  useEffect(() => {
    if (hasCards && !selectedCardId) {
      setSelectedCardId(defaultCard?.id ?? cards[0].id);
    }
  }, [hasCards, selectedCardId, defaultCard?.id, cards]);

  // Si elige tarjeta y no tiene ninguna, abrir form automáticamente
  useEffect(() => {
    if (choice === 'card' && !hasCards) {
      setShowCardForm(true);
    } else if (choice === 'card' && hasCards) {
      // Si tenía form abierto pero ahora ya hay tarjetas, cerrarlo
      // (esto se ejecuta cuando se agrega la primera tarjeta)
      setShowCardForm(false);
    }
  }, [choice, hasCards]);

  const canProceed =
    choice === 'cash' || (choice === 'card' && selectedCardId !== null);

  const handleNext = () => {
    const method: PaymentMethod = choice === 'cash' ? 'cash' : 'credit_card';
    onNext({
      method,
      couponCode: appliedCoupon ?? undefined,
    });
  };

  // Tarjeta actualmente seleccionada (objeto completo)
  const selectedCard = cards.find((c) => c.id === selectedCardId) ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-text-heading">
          Método de pago
        </h2>
        <p className="text-sm text-text mt-0.5">
          Elegí cómo querés pagar tu pedido.
        </p>
      </div>

      {/* Selector tipo de pago: efectivo vs tarjeta */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setChoice('cash')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
            choice === 'cash'
              ? 'border-accent bg-accent-bg shadow-sm'
              : 'border-border hover:border-accent-border'
          )}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              choice === 'cash'
                ? 'bg-accent text-white'
                : 'bg-border/40 text-text'
            )}
          >
            <Banknote className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-heading">Efectivo</p>
            <p className="text-xs text-text">Pagás al repartidor</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setChoice('card')}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
            choice === 'card'
              ? 'border-accent bg-accent-bg shadow-sm'
              : 'border-border hover:border-accent-border'
          )}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              choice === 'card'
                ? 'bg-accent text-white'
                : 'bg-border/40 text-text'
            )}
          >
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-heading">Tarjeta</p>
            <p className="text-xs text-text">Débito o crédito</p>
          </div>
        </button>
      </div>

      {/* Sección de tarjetas (solo si eligió tarjeta) */}
      {choice === 'card' && (
        <div className="space-y-3 animate-fade-in-up">
          {/*
           * Si NO hay tarjetas guardadas: mostrar solo el formulario,
           * sin lista vacía ni mensajes extras (UX más limpia).
           */}
          {!hasCards && (
            <div className="border border-border rounded-xl p-4 bg-bg-elevated">
              <h3 className="text-sm font-semibold text-text-heading mb-3">
                Ingresá tu tarjeta
              </h3>
              <CardForm
                onSuccess={(newCard) => {
                  setSelectedCardId(newCard.id);
                  setShowCardForm(false);
                }}
                submitLabel="Guardar y usar"
              />
            </div>
          )}

          {/*
           * Si HAY tarjetas guardadas:
           *   - Lista con radios para elegir
           *   - Botón "Agregar otra tarjeta" (abre form)
           */}
          {hasCards && !showCardForm && (
            <>
              <p className="text-sm font-medium text-text-heading">
                Elegí una tarjeta:
              </p>
              <div className="space-y-2">
                {cards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    selectable
                    selected={selectedCardId === card.id}
                    onSelect={setSelectedCardId}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowCardForm(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-border text-sm text-text hover:text-accent hover:border-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar otra tarjeta
              </button>
            </>
          )}

          {/* Form para agregar tarjeta ADICIONAL (cuando ya hay otras) */}
          {hasCards && showCardForm && (
            <div className="border border-border rounded-xl p-4 bg-bg-elevated">
              <h3 className="text-sm font-semibold text-text-heading mb-3">
                Agregar nueva tarjeta
              </h3>
              <CardForm
                onSuccess={(newCard) => {
                  setSelectedCardId(newCard.id);
                  setShowCardForm(false);
                }}
                onCancel={() => setShowCardForm(false)}
                submitLabel="Guardar y usar"
              />
            </div>
          )}

          {/*
           * Banner de confirmación: SOLO se muestra cuando:
           *   - hay una tarjeta seleccionada (selectedCard existe)
           *   - el form de nueva tarjeta NO está abierto
           * Muestra marca, últimos 4 dígitos Y nombre del titular.
           */}
          {selectedCard && !showCardForm && (
            <div className="flex items-start gap-2 text-xs text-text bg-accent-bg rounded-lg p-3">
              <Lock className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>
                  Se cobrará a:{' '}
                  <span className="font-semibold text-text-heading">
                    {getShortMask(selectedCard.brand, selectedCard.last4)}
                  </span>
                </p>
                <p className="mt-0.5 text-text/70">
                  Titular:{' '}
                  <span className="font-medium text-text-heading">
                    {selectedCard.holderName}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cupón */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-heading">¿Tenés un cupón?</p>
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
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1"
        >
          Ver resumen
        </Button>
      </div>
    </div>
  );
}