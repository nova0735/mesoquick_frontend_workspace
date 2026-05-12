import { create } from 'zustand';
import { PackageTimer } from '../../../shared/lib/packageTimer';

interface FeedState {
  availableOrders: any[];
  setOrders: (orders: any[]) => void;
  removeOrder: (orderId: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  availableOrders: [],

  setOrders: (orders) => {
    orders.forEach((order) => {
      if (order.category === 'PACKAGE') {
        PackageTimer.start(order.orderId, () => {
          get().removeOrder(order.orderId);
        });
      }
    });
    set({ availableOrders: orders });
  },

  removeOrder: (orderId) => {
    set((state) => ({
      availableOrders: state.availableOrders.filter((o) => o.orderId !== orderId),
    }));
  },
}));