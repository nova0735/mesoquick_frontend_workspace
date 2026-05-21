import { useState } from 'react';
import { useCartStore } from './useCartStore';
import type { AddToCartPayload, AddToCartResult } from './cart.types';

/**
 * REGLA CRÍTICA: Un solo comercio por pedido.
 *
 * Este hook encapsula toda la lógica de agregar al carrito con detección
 * de conflicto de comercio. Los componentes NUNCA llaman a useCartStore
 * directamente para agregar; siempre usan este hook.
 */
export function useCartActions() {
  const { addItem, clearCart, currentBusinessId, currentBusinessName } = useCartStore();

  // Producto "pendiente" que espera confirmación cuando hay conflicto
  const [pendingPayload, setPendingPayload] = useState<
    (AddToCartPayload & { businessId: string }) | null
  >(null);

  const isConflictOpen = pendingPayload !== null;

  /**
   * Intenta agregar un producto al carrito.
   * Si hay conflicto de comercio, guarda el payload y retorna el conflicto.
   * El componente debe mostrar DifferentBusinessModal y llamar a
   * confirmReplace() o cancelReplace() según la elección del usuario.
   */
  const tryAddToCart = (
    payload: AddToCartPayload & { businessId: string }
  ): AddToCartResult => {
    const { product, businessId, businessName, quantity = 1, notes } = payload;

    // Carrito vacío o mismo comercio → agregar directo
    if (!currentBusinessId || currentBusinessId === businessId) {
      addItem(product, businessId, businessName, quantity, notes);
      return { success: true };
    }

    // Comercio diferente → guardar pending y avisar conflicto
    setPendingPayload(payload);
    return {
      success: false,
      conflict: true,
      incomingBusinessName: businessName,
      currentBusinessName: currentBusinessName ?? '',
    };
  };

  /** Usuario acepta vaciar carrito y agregar el nuevo producto */
  const confirmReplace = () => {
    if (!pendingPayload) return;
    const { product, businessId, businessName, quantity = 1, notes } = pendingPayload;
    clearCart();
    addItem(product, businessId, businessName, quantity, notes);
    setPendingPayload(null);
  };

  /** Usuario cancela → no se agrega nada */
  const cancelReplace = () => {
    setPendingPayload(null);
  };

  return {
    tryAddToCart,
    confirmReplace,
    cancelReplace,
    isConflictOpen,
    conflictCurrentBusiness: currentBusinessName ?? '',
    conflictIncomingBusiness: pendingPayload?.businessName ?? '',
  };
}
