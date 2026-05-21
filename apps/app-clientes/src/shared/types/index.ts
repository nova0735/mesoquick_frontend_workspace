/**
 * Tipos base compartidos entre features.
 * Cada feature puede tener tipos propios en su carpeta `model/`.
 */

// ===========================
// COMERCIO (Restaurante / Farmacia / Súper)
// ===========================

export type BusinessCategory = 'restaurant' | 'pharmacy' | 'supermarket';

export type BusinessStatus = 'open' | 'closed' | 'busy';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  status: BusinessStatus;
  deliveryTime: string; // ej: "20-30 min"
  deliveryFee: number;
  minOrder: number;
  tags: string[];
}

// ===========================
// PRODUCTO (platillo / artículo)
// ===========================

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

// ===========================
// CARRITO
// ===========================

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

// ===========================
// PEDIDO
// ===========================

export type OrderStatus =
  | 'pending'      // Esperando confirmación
  | 'confirmed'    // Confirmado por el comercio
  | 'preparing'   // En preparación
  | 'on_the_way'   // En camino
  | 'delivered'   // Entregado
  | 'cancelled';   // Cancelado

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  createdAt: string; // ISO date
  estimatedDelivery: string; // ISO date
  couponCode?: string;
}

// ===========================
// USUARIO
// ===========================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  createdAt: string;
}

// ===========================
// API RESPONSE WRAPPER
// ===========================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}