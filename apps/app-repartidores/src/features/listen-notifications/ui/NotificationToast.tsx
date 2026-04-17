import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNotificationStore } from '../model/useNotificationStore';
import { initNotificationsWS } from '../api/notifications.ws';

export const NotificationToast: React.FC = () => {
  // Use atomic selectors to satisfy constraints
  const notifications = useNotificationStore((state) => state.notifications);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  useEffect(() => {
    initNotificationsWS((data: any) => {
      if (data && typeof data === 'object') {
        const id = data.id || new Date().getTime().toString() + Math.random().toString();
        addNotification({
          id,
          message: data.message || 'New notification',
          type: data.type || 'INFO',
        });
      }
    });
  }, [addNotification]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      const timer = setTimeout(() => {
        removeNotification(latestNotification.id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  const portalRoot = document.getElementById('root') || document.body;

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif) => {
        let bgColor = 'bg-[#3c606b]'; // Default INFO
        if (notif.type === 'APPROVED') bgColor = 'bg-[#56bd64]';
        else if (notif.type === 'REJECTED') bgColor = 'bg-red-500';

        return (
          <div 
            key={notif.id} 
            className={`${bgColor} text-white px-4 py-3 rounded shadow-lg transition-all duration-300 pointer-events-auto`}
          >
            {notif.message}
          </div>
        );
      })}
    </div>,
    portalRoot
  );
};
