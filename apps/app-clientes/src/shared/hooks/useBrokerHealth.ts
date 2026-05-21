import { useEffect, useState } from 'react';

/**
 * Estado del broker visto desde el cliente.
 *  - 'checking': aún no se hizo el primer ping (estado inicial muy breve).
 *  - 'online':   broker respondió 200 en el último ping.
 *  - 'offline':  broker no respondió (timeout, error de red, o status != 2xx).
 *
 * Este estado se usa para mostrar un indicador visual al usuario y refleja
 * en vivo la decisión que toma la app entre broker y fallback mock: cuando
 * está 'offline', los pedidos/cupones/etc se resuelven con respaldo local.
 */
export type BrokerStatus = 'checking' | 'online' | 'offline';

const BROKER_HEALTH_URL =
  'https://broker-services-production.up.railway.app/health';

const PING_INTERVAL_MS = 30_000; // cada 30 segundos
const PING_TIMEOUT_MS = 4_000;   // 4s para responder; si tarda más, offline

/**
 * Hook que monitorea la disponibilidad del broker en background.
 *
 * Hace una llamada inicial al montar y luego repite cada 30s.
 * Devuelve el estado actual, que la UI puede mostrar como un dot 🟢/🟡.
 *
 * Idéntico patrón al usado en auth/catalog/checkout: si el broker no
 * responde en 4s, lo marcamos como offline. La app sigue funcionando con
 * los fallbacks locales sin que el usuario se entere.
 */
export function useBrokerHealth(): BrokerStatus {
  const [status, setStatus] = useState<BrokerStatus>('checking');

  useEffect(() => {
    let cancelled = false;

    async function ping() {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
      try {
        const response = await fetch(BROKER_HEALTH_URL, {
          signal: controller.signal,
          // No mandamos credenciales: /health debería ser público.
        });
        if (!cancelled) {
          setStatus(response.ok ? 'online' : 'offline');
        }
      } catch {
        if (!cancelled) {
          setStatus('offline');
        }
      } finally {
        clearTimeout(timer);
      }
    }

    // Primer ping inmediato al montar
    ping();

    // Pings periódicos
    const intervalId = setInterval(ping, PING_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return status;
}