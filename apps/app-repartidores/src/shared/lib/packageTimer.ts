const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const PackageTimer = {
  start: (orderId: string, onExpire: () => void) => {
    if (timers.has(orderId)) {
      clearTimeout(timers.get(orderId));
    }
    const timeoutId = setTimeout(() => {
      onExpire();
      timers.delete(orderId);
    }, 300000); // Expires after 5 minutes
    timers.set(orderId, timeoutId);
  },
  clear: (orderId: string) => {
    if (timers.has(orderId)) {
      clearTimeout(timers.get(orderId));
      timers.delete(orderId);
    }
  },
};