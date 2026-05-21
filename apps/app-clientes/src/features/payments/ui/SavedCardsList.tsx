import { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { Button } from '@shared/ui';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import CardItem from './CardItem';
import CardForm from './CardForm';

interface SavedCardsListProps {
  /** Variante visual */
  variant?: 'profile' | 'checkout';
  /** Para modo checkout: tarjeta seleccionada */
  selectedCardId?: string | null;
  /** Para modo checkout: callback al seleccionar */
  onSelectCard?: (cardId: string) => void;
}

/**
 * Lista de tarjetas guardadas con opción de agregar nueva.
 *
 * - variant="profile": modo edición (eliminar, marcar predeterminada)
 * - variant="checkout": modo selección (radio buttons)
 */
export default function SavedCardsList({
  variant = 'profile',
  selectedCardId,
  onSelectCard,
}: SavedCardsListProps) {
  const { cards, removeCard, setDefaultCard } = usePaymentMethods();
  const [showForm, setShowForm] = useState(false);

  const isProfile = variant === 'profile';
  const isCheckout = variant === 'checkout';

  return (
    <div className="space-y-3">
      {/* Lista de tarjetas existentes */}
      {cards.length > 0 ? (
        <div className="space-y-2">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              selectable={isCheckout}
              selected={isCheckout && selectedCardId === card.id}
              onSelect={onSelectCard}
              removable={isProfile}
              onRemove={removeCard}
              canSetDefault={isProfile}
              onSetDefault={setDefaultCard}
            />
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-8 px-4 border border-dashed border-border rounded-xl">
            <CreditCard className="w-10 h-10 mx-auto text-text/40 mb-2" />
            <p className="text-sm text-text">
              No tenés tarjetas guardadas todavía.
            </p>
          </div>
        )
      )}

      {/* Formulario para nueva tarjeta */}
      {showForm ? (
        <div className="border border-border rounded-xl p-4 bg-bg-elevated">
          <h3 className="text-sm font-semibold text-text-heading mb-3">
            Agregar nueva tarjeta
          </h3>
          <CardForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => setShowForm(true)}
          className="!justify-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar tarjeta
        </Button>
      )}
    </div>
  );
}