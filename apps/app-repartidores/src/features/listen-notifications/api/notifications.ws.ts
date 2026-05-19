import { SocketManager } from '@mesoquick/core-network';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initNotificationsWS = (onMessage: (data: any) => void) => {
  const socketManager = SocketManager.getInstance();
  const path = '/ws/notifications';
  
  socketManager.connect(path);
  socketManager.subscribe(path, onMessage);
};
