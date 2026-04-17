import { useAvailabilityStore } from '../../features/toggle-courier-status/model/useAvailabilityStore';
import { SocketManager } from '@mesoquick/core-network';

let watchId: number | null = null;

useAvailabilityStore.subscribe((state, prevState) => {
  if (state.isAvailable && !prevState.isAvailable) {
    SocketManager.getInstance().connect('/ws/couriers/me/location');
    
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        SocketManager.getInstance().emit('/ws/couriers/me/location', {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    }
  } else if (!state.isAvailable && prevState.isAvailable) {
    if (watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    SocketManager.getInstance().disconnect('/ws/couriers/me/location');
  }
});
