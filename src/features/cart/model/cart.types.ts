import type { CartItem } from '@shared/types';

/** Estado completo del carrito */
export interface CartState {
  items: CartItem[];
  /** ID del comercio activo en el carrito. null si está vacío. */
  currentBusinessId: string | null;
  /** Nombre del comercio activo (para mostrar en el modal de conflicto). */
  currentBusinessName: string | null;
}

/** Payload para agregar al carrito */
export interface AddToCartPayload {
  product: CartItem['product'];
  quantity?: number;
  notes?: string;
  /** Nombre del comercio del producto que se quiere agregar */
  businessName: string;
}

/** Resultado de intentar agregar un producto */
export type AddToCartResult =
  | { success: true }
  | { success: false; conflict: true; incomingBusinessName: string; currentBusinessName: string };
