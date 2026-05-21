import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '@shared/ui';
import { cn } from '@shared/lib/cn';
import type { CardFormInput, SavedCard } from '../types';
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  getBrandLabel,
  validateCardForm,
} from '../utils/cardUtils';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CardFormProps {
  /** Callback al agregar la tarjeta exitosamente */
  onSuccess?: (card: SavedCard) => void;
  /** Callback al cancelar (cerrar form) */
  onCancel?: () => void;
  /** Texto del botón de envío */
  submitLabel?: string;
}

const INITIAL_INPUT: CardFormInput = {
  number: '',
  holderName: '',
  expMonth: '',
  expYear: '',
  cvv: '',
};

/**
 * Formulario para agregar una tarjeta nueva.
 *
 * Después de validar, solo persiste los últimos 4 dígitos y metadatos
 * no sensibles. El número completo y CVV se descartan inmediatamente.
 */
export default function CardForm({
  onSuccess,
  onCancel,
  submitLabel = 'Guardar tarjeta',
}: CardFormProps) {
  const { addCard } = usePaymentMethods();
  const [input, setInput] = useState<CardFormInput>(INITIAL_INPUT);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CardFormInput, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const brand = detectCardBrand(input.number);
  const brandLabel = getBrandLabel(brand);

  function update<K extends keyof CardFormInput>(
    field: K,
    value: string
  ): void {
    let processedValue = value;

    if (field === 'number') {
      processedValue = formatCardNumber(value);
    } else if (field === 'cvv') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'expMonth') {
      processedValue = value.replace(/\D/g, '').slice(0, 2);
    } else if (field === 'expYear') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setInput((prev) => ({ ...prev, [field]: processedValue }));

    // Limpiar error del campo cuando el usuario lo edita
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    setSubmitting(true);

    const result = validateCardForm(input);

    if (!result.isValid) {
      setErrors(result.errors);
      setSubmitting(false);
      return;
    }

    // Agregar tarjeta (solo se persisten datos no sensibles)
    const newCard = addCard(input);

    // Reset del form
    setInput(INITIAL_INPUT);
    setErrors({});
    setSubmitting(false);

    onSuccess?.(newCard);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Cabecera con info de seguridad */}
      <div className="flex items-center gap-2 text-xs text-text bg-accent-bg rounded-lg p-3">
        <Lock className="w-4 h-4 text-accent flex-shrink-0" />
        <span>
          Tus datos están protegidos. Solo guardamos los últimos 4 dígitos.
        </span>
      </div>

      {/* Número de tarjeta */}
      <div>
        <label
          htmlFor="card-number"
          className="block text-sm font-medium text-text-heading mb-1"
        >
          Número de tarjeta
        </label>
        <div className="relative">
          <input
            id="card-number"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={input.number}
            onChange={(e) => update('number', e.target.value)}
            className={cn(
              'w-full px-3 py-2 pr-20 rounded-lg border bg-white text-text-heading text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent/30',
              errors.number
                ? 'border-red-400 focus:border-red-500'
                : 'border-border focus:border-accent'
            )}
          />
          {brand !== 'unknown' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-accent">
              <CreditCard className="w-4 h-4" />
              {brandLabel}
            </div>
          )}
        </div>
        {errors.number && (
          <p className="mt-1 text-xs text-red-500">{errors.number}</p>
        )}
      </div>

      {/* Nombre del titular */}
      <div>
        <label
          htmlFor="card-holder"
          className="block text-sm font-medium text-text-heading mb-1"
        >
          Nombre del titular
        </label>
        <input
          id="card-holder"
          type="text"
          autoComplete="cc-name"
          placeholder="Como aparece en la tarjeta"
          value={input.holderName}
          onChange={(e) => update('holderName', e.target.value)}
          className={cn(
            'w-full px-3 py-2 rounded-lg border bg-white text-text-heading text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent/30',
            errors.holderName
              ? 'border-red-400 focus:border-red-500'
              : 'border-border focus:border-accent'
          )}
        />
        {errors.holderName && (
          <p className="mt-1 text-xs text-red-500">{errors.holderName}</p>
        )}
      </div>

      {/* Fecha de expiración + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text-heading mb-1">
            Vencimiento
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp-month"
              placeholder="MM"
              value={input.expMonth}
              onChange={(e) => update('expMonth', e.target.value)}
              className={cn(
                'w-1/2 px-3 py-2 rounded-lg border bg-white text-text-heading text-sm text-center transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-accent/30',
                errors.expMonth
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border focus:border-accent'
              )}
            />
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp-year"
              placeholder="AAAA"
              value={input.expYear}
              onChange={(e) => update('expYear', e.target.value)}
              className={cn(
                'w-1/2 px-3 py-2 rounded-lg border bg-white text-text-heading text-sm text-center transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-accent/30',
                errors.expYear
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border focus:border-accent'
              )}
            />
          </div>
          {(errors.expMonth || errors.expYear) && (
            <p className="mt-1 text-xs text-red-500">
              {errors.expMonth || errors.expYear}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="card-cvv"
            className="block text-sm font-medium text-text-heading mb-1"
          >
            CVV
          </label>
          <input
            id="card-cvv"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder={brand === 'amex' ? '1234' : '123'}
            value={input.cvv}
            onChange={(e) => update('cvv', e.target.value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg border bg-white text-text-heading text-sm text-center tracking-widest transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent/30',
              errors.cvv
                ? 'border-red-400 focus:border-red-500'
                : 'border-border focus:border-accent'
            )}
          />
          {errors.cvv && (
            <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}