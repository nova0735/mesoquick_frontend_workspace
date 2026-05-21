import { CreditCard, Trash2, Star } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { SavedCard } from '../types';
import { getBrandLabel } from '../utils/cardUtils';

interface CardItemProps {
  card: SavedCard;
  /** Si es seleccionable (modo checkout) */
  selectable?: boolean;
  /** Si está seleccionada actualmente */
  selected?: boolean;
  /** Callback al clickear (modo checkout) */
  onSelect?: (cardId: string) => void;
  /** Si se muestra el botón de eliminar */
  removable?: boolean;
  onRemove?: (cardId: string) => void;
  /** Si se muestra acción para marcar como predeterminada */
  canSetDefault?: boolean;
  onSetDefault?: (cardId: string) => void;
}

/**
 * Estilo visual por marca: gradientes inspirados en las tarjetas reales,
 * pero adaptados a la paleta del proyecto.
 */
const BRAND_GRADIENTS: Record<string, string> = {
  visa: 'from-blue-600 to-blue-800',
  mastercard: 'from-orange-500 to-red-600',
  amex: 'from-slate-700 to-slate-900',
  discover: 'from-orange-400 to-orange-600',
  unknown: 'from-gray-500 to-gray-700',
};

export default function CardItem({
  card,
  selectable = false,
  selected = false,
  onSelect,
  removable = false,
  onRemove,
  canSetDefault = false,
  onSetDefault,
}: CardItemProps) {
  const gradient = BRAND_GRADIENTS[card.brand] ?? BRAND_GRADIENTS.unknown;

  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(card.id);
    }
  };

  const Wrapper = selectable ? 'button' : 'div';
  const wrapperProps = selectable
    ? { type: 'button' as const, onClick: handleClick }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'w-full text-left rounded-xl border transition-all overflow-hidden',
        selectable && 'cursor-pointer hover:border-accent/60',
        selected
          ? 'border-accent shadow-md ring-2 ring-accent/20'
          : 'border-border'
      )}
    >
      <div className="flex items-center gap-3 p-3 bg-white">
        {/* Tarjeta visual mini con gradiente de la marca */}
        <div
          className={cn(
            'w-12 h-8 rounded-md bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm',
            gradient
          )}
        >
          <CreditCard className="w-4 h-4 text-white" />
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-heading">
              {getBrandLabel(card.brand)}
            </p>
            <p className="text-sm text-text font-mono tabular-nums">
              •••• {card.last4}
            </p>
            {card.isDefault && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-bg text-accent">
                <Star className="w-2.5 h-2.5 fill-current" />
                Predeterminada
              </span>
            )}
          </div>
          <p className="text-xs text-text mt-0.5 truncate">
            {card.holderName} · Vence{' '}
            {String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}
          </p>
        </div>

        {/* Acciones (solo en modo perfil) */}
        {!selectable && (removable || canSetDefault) && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {canSetDefault && !card.isDefault && (
              <button
                type="button"
                onClick={() => onSetDefault?.(card.id)}
                aria-label="Marcar como predeterminada"
                title="Marcar como predeterminada"
                className="p-2 rounded-lg text-text hover:text-accent hover:bg-accent-bg transition-colors"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            {removable && (
              <button
                type="button"
                onClick={() => onRemove?.(card.id)}
                aria-label="Eliminar tarjeta"
                title="Eliminar tarjeta"
                className="p-2 rounded-lg text-text hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Indicador de selección (modo checkout) */}
        {selectable && (
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
              selected
                ? 'border-accent bg-accent'
                : 'border-border'
            )}
          >
            {selected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        )}
      </div>
    </Wrapper>
  );
}