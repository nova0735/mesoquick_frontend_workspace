import { SocketManager } from '@mesoquick/core-network';

export const initFeedWS = (
  onBatch: (orders: any[]) => void,
  onRemoved: (orderId: string) => void
) => {
  const path = '/ws/orders/available';
  const manager = SocketManager.getInstance();

  // 1. Conectar al canal multiplexado
  manager.connect(path);

  // 2. Suscribirse a los mensajes entrantes del servidor
  manager.subscribe(path, (payload: any) => {
    // Según el DTO 'AvailableOrdersEvent' del backend, los mensajes traen un 'eventType'
    if (payload?.eventType === 'NEW_ORDERS_BATCH' && payload.orders) {
      onBatch(payload.orders);
    } 
    else if (payload?.eventType === 'ORDER_REMOVED' && payload.orderId) {
      onRemoved(payload.orderId);
    }
  });

  // 3. Retornar la función de limpieza (Cleanup) para cuando el componente se desmonte
  return () => {
    manager.disconnect(path);
  };
};