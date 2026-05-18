import { create } from 'zustand';

interface ActiveOrderState {
  activeOrder: any | null;
  setActiveOrder: (order: any) => void;
  clearOrder: () => void;
}

export const useActiveOrderStore = create<ActiveOrderState>((set) => ({
  activeOrder: { 
    orderId: "ORD-9982-GT", 
    currentStatus: "ACCEPTED", 
    customerName: "Ana López", 
    pickupAddress: "Restaurante El Comal, Zona 1", 
    deliveryAddress: "Condominio Las Luces, Zona 15", 
    totalAmount: 125.00,
    destinationCoordinates: { lat: 14.6349, lng: -90.5069 },
    destinationAddress: "Condominio Las Luces, Zona 15"
  },
  setActiveOrder: (order) => set({ activeOrder: order }),
  clearOrder: () => set({ activeOrder: null }),
}));