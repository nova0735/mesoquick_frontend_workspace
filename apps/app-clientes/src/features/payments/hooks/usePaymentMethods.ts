import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import type { CardFormInput, SavedCard } from '../types';
import { detectCardBrand, getLast4 } from '../utils/cardUtils';

/**
 * Store global de tarjetas guardadas.
 *
 * Cada tarjeta está vinculada a un userId. Los componentes UI consumen
 * el hook usePaymentMethods() que filtra automáticamente por el usuario
 * logueado, así que cuando alguien cierra sesión y otro entra, ve solo
 * SUS tarjetas.
 *
 * NOTA DE SEGURIDAD: solo se persisten últimos 4 dígitos + metadatos.
 * El PAN completo y CVV se descartan apenas se valida el form.
 */

interface PaymentMethodsState {
  /** TODAS las tarjetas de todos los usuarios (filtradas por hook) */
  allCards: SavedCard[];
  addCard: (userId: string, input: CardFormInput) => SavedCard;
  removeCard: (cardId: string) => void;
  setDefaultCard: (userId: string, cardId: string) => void;
}

export const usePaymentMethodsStore = create<PaymentMethodsState>()(
  persist(
    (set, get) => ({
      allCards: [],

      addCard: (userId, input) => {
        const brand = detectCardBrand(input.number);
        const last4 = getLast4(input.number);

        // Verificar si es la primera tarjeta DEL USUARIO (no del store global)
        const userCards = get().allCards.filter((c) => c.userId === userId);
        const isFirstCardOfUser = userCards.length === 0;

        const newCard: SavedCard = {
          id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          userId,
          brand,
          last4,
          holderName: input.holderName.trim(),
          expMonth: parseInt(input.expMonth, 10),
          expYear: parseInt(input.expYear, 10),
          isDefault: isFirstCardOfUser,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ allCards: [...state.allCards, newCard] }));
        return newCard;
      },

      removeCard: (cardId) => {
        set((state) => {
          const removed = state.allCards.find((c) => c.id === cardId);
          if (!removed) return state;

          let filtered = state.allCards.filter((c) => c.id !== cardId);

          // Si la borrada era predeterminada, marcar otra del mismo usuario
          if (removed.isDefault) {
            const userCards = filtered.filter(
              (c) => c.userId === removed.userId
            );
            if (userCards.length > 0) {
              const firstUserCardId = userCards[0].id;
              filtered = filtered.map((c) =>
                c.id === firstUserCardId ? { ...c, isDefault: true } : c
              );
            }
          }

          return { allCards: filtered };
        });
      },

      setDefaultCard: (userId, cardId) => {
        set((state) => ({
          allCards: state.allCards.map((card) => {
            // Solo afecta tarjetas del mismo usuario
            if (card.userId !== userId) return card;
            return { ...card, isDefault: card.id === cardId };
          }),
        }));
      },
    }),
    {
      name: 'mesoquick:saved-cards',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Hook helper que filtra tarjetas por el usuario logueado.
 *
 * Si no hay sesión activa, devuelve lista vacía y las acciones quedan
 * deshabilitadas (no-op).
 */
export function usePaymentMethods() {
  const allCards = usePaymentMethodsStore((s) => s.allCards);
  const addCardRaw = usePaymentMethodsStore((s) => s.addCard);
  const removeCardRaw = usePaymentMethodsStore((s) => s.removeCard);
  const setDefaultCardRaw = usePaymentMethodsStore((s) => s.setDefaultCard);
  const user = useAuthStore((s) => s.user);

  // Filtrar tarjetas del usuario actual (si no hay sesión, lista vacía)
  const cards = user ? allCards.filter((c) => c.userId === user.id) : [];

  const defaultCard = cards.find((c) => c.isDefault) ?? null;

  // Wrappers que inyectan el userId del usuario actual
  const addCard = (input: CardFormInput) => {
    if (!user) {
      throw new Error('Debe iniciar sesión para agregar una tarjeta');
    }
    return addCardRaw(user.id, input);
  };

  const setDefaultCard = (cardId: string) => {
    if (!user) return;
    setDefaultCardRaw(user.id, cardId);
  };

  return {
    cards,
    defaultCard,
    addCard,
    removeCard: removeCardRaw,
    setDefaultCard,
    hasCards: cards.length > 0,
  };
}