export type OrderCategory = 'RESTAURANT' | 'SUPERMARKET' | 'PHARMACY' | 'PACKAGE';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD';

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  offeredFee: number;
  paymentMethod: PaymentMethod;
  estimatedDistanceKm: number;
  category: OrderCategory;
  status: OrderStatus;
  sender: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  recipient: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
}
