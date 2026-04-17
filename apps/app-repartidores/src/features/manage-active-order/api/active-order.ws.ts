import { SocketManager } from '@mesoquick/core-network';

export const initActiveOrderWS = (
  onUpdate: (order: any) => void
) => {
  const path = '/ws/orders/active';
  const manager = SocketManager.getInstance();

  manager.connect(path);

  manager.subscribe(path, (payload: any) => {
    onUpdate(payload);
  });

  return () => {
    manager.disconnect(path);
  };
};