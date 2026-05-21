/**
 * Representación humanizada y compacta de un timestamp ISO relativo al ahora.
 * Pensado para listas/inbox donde el espacio horizontal es limitado.
 *
 * Ejemplos: "ahora", "hace 3 min", "hace 2 h", "hace 1 d".
 */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 30) return 'ahora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return 'hace menos de 1 min';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

/**
 * Versión absoluta corta para mensajes individuales del chat. Formato local
 * (HH:MM) sin mostrar fecha cuando es del mismo día.
 */
export function formatMessageTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const time = date.toLocaleTimeString('es-HN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (sameDay) return time;
  return `${date.toLocaleDateString('es-HN')} · ${time}`;
}
